import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

import clone from 'just-clone'

import Vue from 'vue'
import defaultGallery from '~/utils/default-gallery'

export type Dot = { ind: number; on: boolean }
export type RawDots = Array<Dot>
export type Dots = { dots: RawDots; color: string | null }
export type SavedDots = {
  created_at: number
  dots: RawDots
  color: string | null
}

const DOT_COLORS = [
  '#b2ff59', // light green
  '#18ffff', // cyan
  '#ff8a80', // red
]

@Module({
  name: 'matrix',
  stateFactory: true,
  namespaced: true,
})
export default class Matrix extends VuexModule {
  dots: RawDots = [...new Array(64).keys()].map((v) => ({ ind: v, on: false }))
  isBoxDot = false
  savedDots: SavedDots[] = defaultGallery
  dotColor: string | null = DOT_COLORS[0]
  defaultDotColor = DOT_COLORS[0]
  version = 0

  get isAllOn() {
    return this.dots.every((v) => v.on)
  }

  get color() {
    return this.dotColor || this.defaultDotColor
  }

  @Mutation
  toggleIsBoxDot() {
    this.isBoxDot = !this.isBoxDot
  }

  @Mutation
  setDot({ ind, on }: Dot) {
    const dot = this.dots[ind]
    Vue.set(this.dots, ind, { ...dot, on })
  }

  @Mutation
  setDots({ dots, color }: { dots: RawDots; color?: string | null }) {
    this.dots = dots
    if (color !== undefined) {
      this.dotColor = color
    }
  }

  @Mutation
  toggleDot(ind: number) {
    const dot = this.dots[ind]
    const on = !dot.on
    Vue.set(this.dots, ind, { ...dot, on })
  }

  @Mutation
  setAllDots(on: boolean) {
    this.dots = this.dots.map((v) => ({ ...v, on }))
  }

  @Mutation
  saveDots() {
    this.savedDots = [
      {
        created_at: Date.now(),
        dots: clone(this.dots),
        color: this.dotColor,
      },
      ...this.savedDots,
    ]
  }

  @Mutation
  removeSavedDots(ind: number) {
    this.savedDots.splice(ind, 1)
  }

  @Mutation
  resetSavedDots() {
    this.savedDots = clone(defaultGallery)
  }

  @Mutation
  setDotColor(color: string | null) {
    this.dotColor = color
  }

  @Mutation
  unsetDotColor() {
    this.dotColor = null
  }

  @Mutation
  setDefaultDotColor(color: string) {
    this.defaultDotColor = color
  }

  @Mutation
  cycleDotColor() {
    const ind = DOT_COLORS.indexOf(this.dotColor || '')
    this.dotColor = DOT_COLORS[(ind + 1) % DOT_COLORS.length]
  }
}
