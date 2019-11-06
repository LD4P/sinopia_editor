// Copyright 2019 Stanford University see LICENSE for license

export const clearTemplateMessages = (state) => {
  const newState = { ...state }

  newState.editor.uploadTemplateMessages = []
  return newState
}

export const setTemplateMessages = (state, action) => {
  const newState = { ...state }

  newState.editor.uploadTemplateMessages = action.messages
  return newState
}
