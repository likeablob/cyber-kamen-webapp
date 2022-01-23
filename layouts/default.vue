<template>
  <v-app>
    <v-app-bar
      class="appbar"
      app="app"
      color="secondary lighten-1"
      dark="dark"
      flat="flat"
      fixed="fixed"
      :height="56"
    >
      <v-toolbar-title>
        <v-btn
          class="font-weight-black green--text"
          text
          @click="matrixStore.cycleDotColor"
          >Cyber kamen</v-btn
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="center"></slot>
      <v-spacer></v-spacer>
      <device-connection-button />
      <blink-button></blink-button>
      <v-btn icon="icon" @click="infoDialog = true">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main class="content">
      <v-container
        class="container"
        fill-height="fill-height"
        grid-list-xs="grid-list-xs"
      >
        <nuxt></nuxt>
      </v-container>
    </v-main>
    <app-info-dialog :dialog.sync="infoDialog"></app-info-dialog>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

import AppInfoDialog from '@/components/AppInfoDialog.vue'
import DeviceConnectionButton from '@/components/DeviceConnectionButton.vue'
import BlinkButton from '~/components/BlinkButton.vue'

import { matrixStore } from '~/store'

export default defineComponent({
  components: {
    AppInfoDialog,
    DeviceConnectionButton,
    BlinkButton,
  },
  setup() {
    const infoDialog = ref(false)
    return {
      infoDialog,
      matrixStore,
    }
  },
})
</script>

<style media="screen" lang="scss" scoped>
.content {
  background-color: white;
}

.container {
  max-height: calc(100vh - 56px);
  overflow: hidden;
  // padding-top: 56px;
}
</style>
