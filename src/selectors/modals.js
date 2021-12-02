// Copyright 2019 Stanford University see LICENSE for license
import _ from "lodash"

export const selectCurrentModal = (state) =>
  _.last(state.editor.currentModal) || null

export const selectUnusedRDF = (state, resourceKey) =>
  state.editor.unusedRDF[resourceKey]

export const isModalOpen = (state) => !_.isEmpty(state.editor.currentModal)

export const isCurrentModal = (state, name) =>
  selectCurrentModal(state) === name

export const selectCurrentLangModalValue = (state) =>
  state.editor.currentLangModalValue

export const selectMarc = (state) => state.editor.marc
