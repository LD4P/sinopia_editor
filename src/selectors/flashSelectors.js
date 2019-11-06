// Copyright 2019 Stanford University see LICENSE for license

export const flashMessages = state => state.selectorReducer.editor.flash.messages

// To avoid have to export flashMessages as default
export const noop = () => {}
