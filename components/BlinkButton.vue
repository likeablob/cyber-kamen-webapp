<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn
        depressed
        icon
        :disabled="!isConnected"
        v-on="on"
        @click="sendConfig"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
    <span>Blink</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import log from 'loglevel'

import { ckBleDeviceStore } from '~/store'

export default defineComponent({
  computed: {
    isConnected: () => ckBleDeviceStore.isConnected,
  },
  methods: {
    sendConfig() {
      ckBleDeviceStore
        .sendConfigCommand({ blinkEnabled: true })
        .catch(log.error)
    },
  },
})
</script>
