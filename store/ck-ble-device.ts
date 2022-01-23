import {
  Module,
  VuexModule,
  Mutation,
  MutationAction,
  Action,
} from 'vuex-module-decorators'

import { encode } from '@msgpack/msgpack'
import split from 'just-split'
import log from 'loglevel'

log.setDefaultLevel('DEBUG')

const CK_SERVICE_UUID = '1546c1bd-186a-498b-89f6-712abee5affd'
const CK_CHARACTERISTIC_NAMES = ['DRAW', 'DRAW_MONO', 'CONFIG'] as const
type CkCharacteristicsT = typeof CK_CHARACTERISTIC_NAMES[number]
const CK_CHARACTERISTIC_UUIDS: { [K in CkCharacteristicsT]: string } = {
  DRAW: '4b8473f1-f01f-4f35-94ca-2c27d5659601',
  DRAW_MONO: '4b8473f1-f01f-4f35-94ca-2c27d5659602',
  CONFIG: '4b8473f1-f01f-4f35-94ca-2c27d5659610',
}

const ckCharacteristics: {
  [P in CkCharacteristicsT]: BluetoothRemoteGATTCharacteristic | undefined
} = {
  DRAW: undefined,
  DRAW_MONO: undefined,
  CONFIG: undefined,
}

// FIXME: Write abstraction layers for Web Bluetooth API and decouple them from the store.

@Module({
  name: 'ck-ble-device',
  stateFactory: true,
  namespaced: true,
  preserveState: false,
})
export default class CkBleDevice extends VuexModule {
  isConnected = false

  @Mutation
  setConnectionState(isConnected: boolean) {
    this.isConnected = isConnected
  }

  @MutationAction
  async connect() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [CK_SERVICE_UUID] }],
    })

    device.addEventListener('gattserverdisconnected', () => {
      log.info('device disconnected')
      this.context.commit('setConnectionState', false)
    })

    const server = await device!.gatt!.connect()
    const service = await server.getPrimaryService(CK_SERVICE_UUID)
    const characteristics = await service.getCharacteristics()

    for (const key of CK_CHARACTERISTIC_NAMES) {
      const uuid = CK_CHARACTERISTIC_UUIDS[key]
      const ch = characteristics.find((v) => v.uuid === uuid)
      if (ch) {
        ckCharacteristics[key] = ch
      }
    }
    log.debug('ckCharacteristics', ckCharacteristics)

    return { isConnected: true }
  }

  @Action
  async sendConfigCommand({
    blinkEnabled,
    colorHex,
  }: {
    blinkEnabled?: boolean
    colorHex?: string
  }) {
    if (!this.isConnected) {
      return
    }

    const settings: {
      blinkEnabled: true | null
      colorHexBin: Uint8Array | null
    } = {
      blinkEnabled: blinkEnabled || null,
      colorHexBin: null,
    }

    if (colorHex !== undefined) {
      settings.colorHexBin = new Uint8Array(
        [0, 2, 4].map((v) =>
          parseInt(colorHex.replace('#', '').slice(v, v + 2), 16)
        )
      )
    }

    const command = encode(Object.values(settings))
    log.debug(command, Object.values(settings))
    log.debug(command.length)
    await ckCharacteristics.CONFIG?.writeValueWithResponse(command)
  }

  @Action
  async sendDrawMonoCommand({
    data,
    colorHex,
  }: {
    data: Array<boolean>
    colorHex: string | null
  }) {
    if (!this.isConnected) {
      return
    }

    let colorHexBin: Uint8Array | null = null
    if (colorHex !== null) {
      colorHexBin = new Uint8Array(
        [0, 2, 4].map((v) =>
          parseInt(colorHex.replace('#', '').slice(v, v + 2), 16)
        )
      )
    }

    const bytes = split(data, 8).map((eightBits) => {
      const byte = eightBits.reduce((p, c, i) => {
        return p | (Number(c) << (7 - i))
      }, 0b0)
      return byte
    })

    const frame = new Uint8Array(bytes)
    const command = encode([colorHexBin, frame])
    log.debug([colorHexBin, frame])
    log.debug(command)
    log.debug(command.length)
    await ckCharacteristics.DRAW_MONO?.writeValueWithResponse(command)
  }
}
