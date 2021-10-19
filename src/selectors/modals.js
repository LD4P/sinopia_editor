// Copyright 2019 Stanford University see LICENSE for license

export const selectModalType = (state) => state.editor.modal.name

export const selectModalMessages = (state) => state.editor.modal.messages

export const selectUnusedRDF = (state, resourceKey) =>
  state.editor.unusedRDF[resourceKey]

export const isModalOpen = (state) => !!state.editor.modal.name

export const isCurrentModal = (state, name) => state.editor.modal.name === name
