<template>
  <div>
    <v-dialog v-model="dialog_" max-width="400">
      <v-card>
        <v-card-title class="headline">Draw Text</v-card-title>
        <v-card-text class="virtual-matrix-wrapper pa-0">
          <VirtualMatrix
            :dots="dots"
            :is-box-dot="matrixStore.isBoxDot"
          ></VirtualMatrix>
          <v-btn class="offset-up" color="white" @click="config.offset.y -= 1">
            <v-icon x-large>mdi-chevron-up</v-icon></v-btn
          >
          <v-btn
            class="offset-down"
            color="white"
            @click="config.offset.y += 1"
          >
            <v-icon x-large>mdi-chevron-down</v-icon></v-btn
          >
          <v-btn
            class="offset-left"
            color="white"
            @click="config.offset.x -= 1"
          >
            <v-icon x-large>mdi-chevron-down</v-icon></v-btn
          >
          <v-btn
            class="offset-right"
            color="white"
            @click="config.offset.x += 1"
          >
            <v-icon x-large>mdi-chevron-down</v-icon></v-btn
          >
        </v-card-text>
        <v-card-text class="py-0">
          <v-row justify="end">
            <v-col cols="6">
              <v-text-field v-model="config.text" :counter="2"></v-text-field>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="config.isFullWidth"
                label="Full-Width"
                hide-details
              >
              </v-checkbox>
              <v-checkbox
                v-model="config.useMisaki"
                label="8bit Font (Misaki)"
                hide-details
              >
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="dialog_ = false"
            >Cancel</v-btn
          >
          <v-btn color="info darken-1" text @click="apply">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <canvas
      v-show="false"
      ref="canvas"
      class="text-canvas"
      width="8"
      height="8"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

import split from 'just-split'
import VirtualMatrix from '@/components/VirtualMatrix.vue'

import { matrixStore } from '~/store'

export default defineComponent({
  components: {
    VirtualMatrix,
  },
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

    return {
      dialog_,
      matrixStore,
    }
  },
  data() {
    return {
      dots: [...new Array(64).keys()].map((v) => ({ ind: v, on: false })),
      config: {
        text: '',
        isFullWidth: true,
        useMisaki: true,
        offset: {
          x: 0,
          y: 0,
        },
      },
    }
  },
  watch: {
    dialog() {
      this.draw()
    },
    config: {
      deep: true,
      handler() {
        this.draw()
      },
    },
  },
  mounted() {},
  methods: {
    toFullWidth(str: string) {
      return str.replace(/[A-Za-z0-9]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) + 0xfee0)
      })
    },
    draw() {
      const canvas = this.$refs.canvas as HTMLCanvasElement
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return
      }

      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.height, canvas.width)
      ctx.fillStyle = 'black'
      if (this.config.useMisaki) {
        ctx.font = '8px misaki_gothic'
      } else {
        ctx.font = '9px sans'
      }
      ctx.textBaseline = 'middle'

      let text = this.config.text
      if (this.config.isFullWidth) {
        text = this.toFullWidth(text)
      }
      const xOffset = this.config.offset.x
      text = text.trim()

      const yOffset = this.config.offset.y
      ctx.save()
      ctx.translate(4, 4)
      // ctx.rotate((Math.PI * -90) / 180)
      // ctx.scale(-1, 1)
      ctx.fillText(text, xOffset - 8 / 2, yOffset)
      ctx.restore()

      const imgData = ctx.getImageData(0, 0, canvas.height, canvas.width)
      this.dots = split(Array.from(imgData.data), 4)
        .map((v) => v[0] < 127)
        .map((on, ind) => ({
          on,
          ind,
        }))
    },
    apply() {
      matrixStore.setDots({ dots: this.dots })
      this.dialog_ = false
    },
  },
})
</script>

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
