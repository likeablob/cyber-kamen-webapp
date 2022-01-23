<template>
  <v-btn
    depressed
    :class="{ pulse: !isConnected }"
    color="primary"
    @click="connect"
    >{{ isConnected ? 'Reconnect' : 'Connect' }}</v-btn
  >
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import log from 'loglevel'

import { ckBleDeviceStore } from '~/store'

export default defineComponent({
  computed: {
    isConnected: () => ckBleDeviceStore.isConnected,
  },
  methods: {
    connect: () => ckBleDeviceStore.connect().catch(log.error),
  },
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_colors.scss';

.pulse {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  $pulse-color: map-get(
    $map: $blue,
    $key: 'base',
  );
  0% {
    box-shadow: 0 0 0 0 transparentize($pulse-color, $amount: 0.3);
  }
  80% {
    box-shadow: 0 0 0 15px transparentize($pulse-color, $amount: 1);
  }
  100% {
    box-shadow: 0 0 0 0 transparentize($pulse-color, $amount: 1);
  }
}
</style>
