// Copyright 2019 Stanford University see LICENSE for license

export const selectCurrentModal = (state) => state.editor.currentModal

export const selectUnusedRDF = (state, resourceKey) =>
  state.editor.unusedRDF[resourceKey]

export const isModalOpen = (state) => !!state.editor.currentModal

export const isCurrentModal = (state, name) =>
  state.editor.currentModal === name
