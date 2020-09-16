// Copyright 2019 Stanford University see LICENSE for license

export const selectModalType = (state) => state.selectorReducer.editor.modal.name

export const selectModalMessages = (state) => state.selectorReducer.editor.modal.messages

export const selectUnusedRDF = (state, resourceKey) => state.selectorReducer.editor.unusedRDF[resourceKey]
