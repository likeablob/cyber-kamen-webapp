<template>
  <div class="virtual-matrix-editor">
    <div
      class="virtual-matrix-editor-content"
      title="Hold Ctrl key or drag to draw."
    >
      <VirtualMatrix
        :dots="matrixStore.dots"
        :on-mouseover="toggleDotContinuously"
        :on-mousedown="(dot) => matrixStore.toggleDot(dot.ind)"
        :on-touchmove="toggleDotContinuously"
        :is-box-dot="matrixStore.isBoxDot"
        :dot-color="matrixStore.color"
      ></VirtualMatrix>
    </div>

    <div>
      <v-btn
        color="primary"
        block
        rounded
        outlined
        class="mt-4"
        :disabled="!ckBleDeviceStore.isConnected"
        @click="sendData()"
        >Send</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { Dot } from '~/store/matrix'

import VirtualMatrix from '@/components/VirtualMatrix.vue'

import { ckBleDeviceStore, matrixStore } from '~/store'

export default defineComponent({
  components: {
    VirtualMatrix,
  },
  setup() {
    const prevTouchedInd = ref<null | string>(null)

    const sendData = () => {
      ckBleDeviceStore.sendDrawMonoCommand({
        data: matrixStore.dots.map((v) => v.on),
        colorHex: matrixStore.dotColor,
      })
    }

    const toggleDotContinuously = (ev: TouchEvent | MouseEvent, dot: Dot) => {
      if (ev instanceof TouchEvent && ev.changedTouches[0]) {
        const touch = ev.changedTouches[0]
        const elem = document.elementFromPoint(touch.clientX, touch.clientY)

        const ind = elem?.getAttribute('dot-ind')
        if (ind != null && prevTouchedInd.value !== ind) {
          matrixStore.toggleDot(parseInt(ind))
          prevTouchedInd.value = ind
        }
      } else if (ev instanceof MouseEvent) {
        const leftButton = 1
        if (ev.buttons === leftButton || ev.ctrlKey) {
          matrixStore.toggleDot(dot.ind)
        }
      }
    }

    return {
      matrixStore,
      ckBleDeviceStore,
      sendData,
      toggleDotContinuously,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_colors.scss';
.virtual-matrix-editor {
  position: relative;
  width: 100%;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .virtual-matrix-editor-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .virtual-matrix-writer {
      background: white;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: column;
      .virtual-matrix-msg {
        // margin-top: 2rem;
        // flex: 0 0 25%;
        font-weight: bold;
        font-size: 2rem;
        color: #333;
        display: flex;
        align-items: center;
        flex-direction: column;
        .virtual-matrix-icon {
          animation: jump 1s infinite;
          color: #333;
          margin-bottom: -20%;
        }
      }
      .virtual-matrix-blink {
        // margin-top: 150%;
        width: 200px;
        height: 200px;
        // background: white;
        border-radius: 10%;
        margin-top: 15%;
        margin-bottom: 30%;
        flex: 0 0 auto;
        background-color: black;
        // animation-name: blink;
        // animation-duration: 1s;
        // animation-timing-function: step-start;
        // animation-iteration-count: infinite;
      }
      .virtual-matrix-progress {
        position: absolute;
        bottom: 0;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  .virtual-matrix-blink {
    animation: bounce-in 0.5s;
  }
}
.fade-leave-active {
  .virtual-matrix-blink {
    animation: bounce-in 0.5s reverse;
  }
}
@keyframes bounce-in {
  0% {
    transform: scale(2) translateX(10px);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes jump {
  0% {
    transform: translate3d(0, 0px, 0);
  }
  20% {
    transform: translate3d(0, 5px, 0);
  }
  100% {
    transform: translate3d(0, 0px, 0);
  }
}

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  $pulse-color: map-get(
    $map: $indigo,
    $key: 'base',
  );
  0% {
    box-shadow: 0 0 0 0 transparentize($pulse-color, $amount: 0.3);
  }
  80% {
    box-shadow: 0 0 0 20px transparentize($pulse-color, $amount: 1);
  }
  100% {
    box-shadow: 0 0 0 0 transparentize($pulse-color, $amount: 1);
  }
}
</style>
