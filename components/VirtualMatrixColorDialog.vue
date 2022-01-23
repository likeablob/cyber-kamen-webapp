<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  computed,
} from '@nuxtjs/composition-api'

import { ckBleDeviceStore, matrixStore } from '~/store'

export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:dialog'],
  setup(props, { emit }) {
    const dialog_ = computed({
      get: () => {
        return props.dialog
      },
      set: (v: boolean) => {
        emit('update:dialog', v)
      },
    })

    watch(
      () => props.dialog,
      (v: boolean) => {
        dialog_.value = v
      }
    )

    const colorModes = {
      USE_DEFAULT: 'n/a (Use default)',
      AS_DEFAULT: 'Default',
      AS_UNIQUE: 'Unique',
    }

    const colorModesInd: { [K in keyof typeof colorModes]: number } = {
      USE_DEFAULT: 0,
      AS_DEFAULT: 1,
      AS_UNIQUE: 2,
    }

    const config = reactive({
      livePreview: false,
      colorMode: 0,
      color: '#b2ff59',
    })

    const useDefault = computed(
      () => config.colorMode === colorModesInd.USE_DEFAULT
    )

    const apply = () => {
      if (config.colorMode === colorModesInd.USE_DEFAULT) {
        matrixStore.unsetDotColor()
      } else if (config.colorMode === colorModesInd.AS_DEFAULT) {
        matrixStore.unsetDotColor()
        matrixStore.setDefaultDotColor(config.color)
        ckBleDeviceStore.sendConfigCommand({ colorHex: config.color })
      } else if (config.colorMode === colorModesInd.AS_UNIQUE) {
        matrixStore.setDotColor(config.color)
      }
      dialog_.value = false
    }

    return {
      // data
      config,
      colorModes,
      // computed
      dialog_,
      useDefault,
      // methods
      apply,
    }
  },
})

// const props = defineProps({
//   dialog: {
//     type: Boolean,
//     required: true,
//   },
// })

// const emit = defineEmits(['update:dialog'])
</script>

<template>
  <div>
    <v-dialog v-model="dialog_" max-width="400">
      <v-card>
        <v-card-title class="headline">
          Select Color
          <v-spacer></v-spacer>
          <v-switch
            v-model="config.livePreview"
            label="Live preview"
            dense
            disabled
            hide-details
            class="mt-0"
          ></v-switch>
        </v-card-title>
        <v-form :disabled="useDefault">
          <v-card-text class="virtual-matrix-wrapper pa-0">
            <v-color-picker
              v-model="config.color"
              dot-size="5"
              mode="rgba"
              swatches-max-height="165"
            ></v-color-picker>
          </v-card-text>
          <v-card-text class="py-0">
            <v-row justify="end">
              <v-col>
                <v-label>Save as:</v-label>
                <v-btn-toggle v-model="config.colorMode" mandatory dense>
                  <v-btn v-for="item of colorModes" :key="item">
                    {{ item }}
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="dialog_ = false"
            >Cancel</v-btn
          >
          <v-btn color="info darken-1" text @click="apply">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.virtual-matrix-wrapper {
  width: 300px;
  margin: 0 auto;
  position: relative;
  .offset-up {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.6;
  }
  .offset-down {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    opacity: 0.6;
  }
  .offset-left {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%) rotate(90deg);
    opacity: 0.6;
  }
  .offset-right {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(50%, -50%) rotate(-90deg);
    opacity: 0.6;
  }
}

.misaki {
  font-family: 'misaki_gothic';
}

.text-canvas {
  height: 100px;
  width: 100px;
}
</style>
