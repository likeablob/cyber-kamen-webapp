import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import CkBleDevice from '~/store/ck-ble-device'
import Matrix from '~/store/matrix'

let ckBleDeviceStore: CkBleDevice // eslint-disable-line import/no-mutable-exports
let matrixStore: Matrix // eslint-disable-line import/no-mutable-exports

function initializeStores(store: Store<any>): void {
  ckBleDeviceStore = getModule(CkBleDevice, store)
  matrixStore = getModule(Matrix, store)
}

export { initializeStores, ckBleDeviceStore, matrixStore }
