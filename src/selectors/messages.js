// Copyright 2019 Stanford University see LICENSE for license

export const selectTemplateMessages = (state) => state.selectorReducer.editor.uploadTemplateMessages

// To avoid have to export findTemplateMessages as default
export const noop = () => {}
