// Copyright 2019 Stanford University see LICENSE for license

export const clearFlashMessages = (state) => {
  const newState = { ...state }

  newState.editor.flash.messages = []
  return newState
}

export const setFlashMessages = (state, action) => {
  const newState = { ...state }

  newState.editor.flash.messages = action.messages
  return newState
}
