<template>
  <div class="gallery">
    <v-skeleton-loader v-if="isLoading" type="card@2"></v-skeleton-loader>
    <transition-group
      v-if="!isLoading"
      name="gallery-list"
      tag="div"
      class="row gallery-row"
      @before-leave="beforeLeave"
    >
      <v-col
        v-for="(item, i) in matrixStore.savedDots"
        :key="item.created_at"
        :cols="3"
        class="gallery-col gallery-list-item fade"
        @click="onSelected_(item)"
      >
        <v-btn
          class="remove-button"
          color="red lighten-1"
          dark
          fab
          x-small
          @click.stop="matrixStore.removeSavedDots(i)"
        >
          <v-icon>mdi-delete</v-icon></v-btn
        >
        <VirtualMatrix
          :dots="item.dots"
          :is-box-dot="matrixStore.isBoxDot"
          :border-width="2"
          :dot-color="item.color || matrixStore.defaultDotColor"
        ></VirtualMatrix>
      </v-col>
    </transition-group>
    <transition v-if="!isLoading" name="fade">
      <h2 v-if="!matrixStore.savedDots.length" class="gallery-nodata">
        No Data
        <v-btn small depressed @click="matrixStore.resetSavedDots">Reset</v-btn>
      </h2>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import clone from 'just-clone'

import VirtualMatrix from '@/components/VirtualMatrix.vue'

import { ckBleDeviceStore, matrixStore } from '~/store'
import { Dots, SavedDots } from '~/store/matrix'

export default defineComponent({
  components: {
    VirtualMatrix,
  },
  setup() {
    const isLoading = ref(true)

    onMounted(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 100)
    })

    function loadDots(dots: Dots) {
      ckBleDeviceStore.sendDrawMonoCommand({
        data: dots.dots.map((v) => v.on),
        colorHex: dots.color,
      })
      matrixStore.setDots(clone(dots))
    }

    function beforeLeave(el_: Element) {
      const el = el_ as HTMLElement
      const { marginLeft, marginTop, width, height } =
        window.getComputedStyle(el)
      el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`
      el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`
      el.style.width = width
      el.style.height = height
    }

    function onSelected_(item: SavedDots) {
      loadDots(item)
    }

    return {
      matrixStore,
      isLoading,
      beforeLeave,
      onSelected_,
    }
  },
})
</script>

<style lang="scss" scoped>
.gallery {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100px;
  .gallery-nodata {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    white-space: nowrap;
  }
}

.gallery-row {
  @media screen and (max-width: 600px) {
    overflow-x: scroll;
    overflow-y: hidden;
    flex-wrap: nowrap !important;
  }
}

.gallery-col {
  position: relative;
  min-width: 100px;

  transform: scale(0.95);
  &:hover {
    transform: scale(1);
  }
  .remove-button {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
    opacity: 0.4;
    &:hover {
      opacity: 1;
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

.gallery-list-item {
  transition: all 0.3s;
  display: inline-block;
}
.gallery-list-enter,
.gallery-list-leave-to {
  opacity: 0;
  transform: scale(0.1);
}
.gallery-list-leave-active {
  position: absolute;
}
</style>
