<template>
  <div>
    <v-dialog v-model="dialog_" max-width="450">
      <v-card>
        <v-toolbar flat color="secondary headline" dark>
          <v-icon left>mdi-information</v-icon>
          Cyber Kamen Webapp
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text class="pa-5">
          <VirtualMatrix :dots="iconDots"></VirtualMatrix>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col class="desc-line">
              <v-icon left>mdi-github</v-icon>
              GitHub:
              <a target="_blank" href="https://github.com/likeablob/cyber-kamen"
                >likeablob/cyber-kamen</a
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

import VirtualMatrix from '@/components/VirtualMatrix.vue'

const iconDots = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]
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
      iconDots: iconDots.map((v, i) => ({
        on: !!v,
        ind: i,
      })),
    }
  },
})
</script>

<style lang="scss" scoped>
.desc-line {
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    margin-left: 10px;
  }
}
</style>
