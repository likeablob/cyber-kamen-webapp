<template>
  <v-row justify="center" class="main-row">
    <v-col cols="12" sm="6" lg="4" xl="3" class="pa-1" justify-self="center">
      <v-card
        ref="main"
        tile
        :flat="$vuetify.breakpoint.xs"
        class="main-card rounded-card"
      >
        <v-toolbar
          dense
          flat
          color="secondary lighten-2 hidden-xs-only"
          dark
          class="headline"
        >
          <v-icon left>mdi-pencil-outline</v-icon>
          Editor

          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text>
          <VirtualMatrixEditor></VirtualMatrixEditor>
        </v-card-text>
      </v-card>

      <div class="bottom-buttons mt-2">
        <v-tooltip v-for="item in editorButtons" :key="item.tooltip" top>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              :color="item.color"
              fab
              dark
              small
              v-on="on"
              @click.stop="item.onClick"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ item.tooltip }}</span>
        </v-tooltip>
      </div>
    </v-col>

    <v-col xl="6" class="pa-1">
      <v-card
        class="gallery-card rounded-card"
        :flat="$vuetify.breakpoint.xs"
        tile
      >
        <v-toolbar
          dense
          flat
          color="secondary lighten-2 hidden-xs-only"
          dark
          class="headline"
        >
          <v-icon left>mdi-emoticon-dead</v-icon>
          Faces

          <v-spacer></v-spacer>

          <v-tooltip top>
            <template #activator="{ on }">
              <v-btn
                depressed
                small
                color="red darken-2"
                v-on="on"
                @click="matrixStore.resetSavedDots"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Reset all</span>
          </v-tooltip>
        </v-toolbar>

        <v-card-text class="gallery-wrapper px-5">
          <VirtualMatrixGallery></VirtualMatrixGallery>
        </v-card-text>
      </v-card>
    </v-col>

    <VirtualMatrixTextDialog :dialog.sync="dialogs.textDialog" />
    <VirtualMatrixColorDialog :dialog.sync="dialogs.colorDialog" />
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from '@vue/composition-api'
import { useContext } from '@nuxtjs/composition-api'

import VirtualMatrixEditor from '~/components/VirtualMatrixEditor.vue'
import VirtualMatrixGallery from '@/components/VirtualMatrixGallery.vue'
import VirtualMatrixTextDialog from '@/components/VirtualMatrixTextDialog.vue'
import VirtualMatrixColorDialog from '@/components/VirtualMatrixColorDialog.vue'

import { matrixStore } from '~/store'

export default defineComponent({
  components: {
    VirtualMatrixEditor,
    VirtualMatrixGallery,
    VirtualMatrixTextDialog,
    VirtualMatrixColorDialog,
  },
  setup() {
    const dialogs = reactive({
      textDialog: false,
      colorDialog: false,
    })

    const { $toast } = useContext()

    const editorButtonsStatic = [
      {
        icon: 'mdi-format-text',
        color: 'blue',
        tooltip: 'Text',
        onClick: () => {
          dialogs.textDialog = true
        },
      },
      {
        icon: 'mdi-content-save',
        color: 'red',
        tooltip: 'Save',
        onClick() {
          matrixStore.saveDots()
          $toast.info('Saved')
        },
      },
      {
        icon: 'mdi-palette',
        color: 'orange',
        tooltip: 'Color',
        onClick() {
          dialogs.colorDialog = !dialogs.colorDialog
        },
      },
    ]

    const editorButtons = computed(() => {
      return [
        {
          icon: matrixStore.isAllOn ? 'mdi-lightbulb-off' : 'mdi-lightbulb-on',
          color: matrixStore.isAllOn ? 'gray' : 'green',
          tooltip: 'Clear/Fill',
          onClick: () => {
            matrixStore.setAllDots(!matrixStore.isAllOn)
          },
        },
        ...editorButtonsStatic,
      ]
    })

    return {
      // data
      dialogs,

      // computed
      editorButtons,

      // others
      matrixStore,
    }
  },
})
</script>

<style lang="scss" scoped>
.rounded-card {
  border-radius: 5px !important;
}

.main-card {
  min-width: 300px;
  margin: 0 auto;
}

.gallery-card {
  max-height: 600px;
}

.gallery-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  height: 540px;
  @media screen and (max-width: 600px) {
    height: auto;
  }
}
.bottom-buttons {
  @media screen and (max-width: 600px) {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    z-index: 99;
  }

  display: flex;
  button {
    margin: 5px;
  }
}
</style>
