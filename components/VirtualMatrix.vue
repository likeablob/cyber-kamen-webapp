<template>
  <div class="virtual-matrix">
    <div class="virtual-matrix-content">
      <div :style="dotsStyle" class="virtual-matrix-dots">
        <div
          v-for="dot in dots"
          :key="dot.ind"
          :dot-ind="dot.ind"
          :enabled="dot.on"
          :style="dot.on ? dotStyleOn : dotStyle"
          class="virtual-matrix-dot"
          @click="onClick(dot)"
          @touchmove="(ev) => onTouchmove(ev, dot)"
          @mouseover="(ev) => onMouseover(ev, dot)"
          @mousedown="onMousedown(dot)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'

import { RawDots, Dot } from '~/store/matrix'

export default defineComponent({
  props: {
    dots: {
      type: Array as PropType<RawDots>,
      required: true,
    },
    onClick: {
      type: Function as PropType<(dot: Dot) => void>,
      default: () => {},
    },
    onTouchmove: {
      type: Function as PropType<(ev: TouchEvent, dot: Dot) => void>,
      default: () => {},
    },
    onMouseover: {
      type: Function as PropType<(ev: MouseEvent, dot: Dot) => void>,
      default: () => {},
    },
    onMousedown: {
      type: Function as PropType<(dot: Dot) => void>,
      default: () => {},
    },
    isBoxDot: {
      type: Boolean,
      default: true,
    },
    borderWidth: {
      type: Number,
      default: 4,
    },
    dotColor: {
      type: String,
      default: 'yellowgreen',
    },
  },
  setup(props) {
    const dotStyle = computed(() => {
      const style = {
        borderRadius: props.isBoxDot ? '18%' : '50%',
        borderWidth: `${props.borderWidth}px`,
      }
      return style
    })

    const dotStyleOn = computed(() => {
      const style = {
        borderRadius: props.isBoxDot ? '18%' : '50%',
        borderWidth: `${props.borderWidth}px`,
        backgroundColor: props.dotColor,
      }
      return style
    })
    const dotsStyle = computed(() => {
      return {
        padding: `${props.borderWidth}px`,
      }
    })

    return {
      dotStyle,
      dotStyleOn,
      dotsStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.virtual-matrix {
  position: relative;
  width: 100%;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .virtual-matrix-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .virtual-matrix-dots {
      border-radius: 2%;
      background: black;
      box-sizing: border-box;
      padding: 3px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      user-select: none;
      flex-direction: row;
      .virtual-matrix-dot {
        background: gray;
        border: 5px solid black;
        flex: 1 1 12.5%;
        border-radius: 20%;
        box-sizing: border-box;
        transition: background-color 0.3s, border-radius 1s;
        &[enabled] {
          background: yellowgreen;
        }
      }
    }
  }
}
</style>
