// Copyright 2018, 2019 Stanford University see LICENSE for license
export const setLiteralInputContent = (state, action) => {
  const newState = { ...state }

  newState.editor.content[action.payload.key] = action.payload.literal

  return newState
}

export const hideDiacriticsSelection = (state) => {
  const newState = { ...state }
  newState.editor.diacritics.show = false
  newState.editor.diacritics.key = null
  return newState
}

export const showDiacriticsSelection = (state, action) => {
  const newState = { ...state }
  newState.editor.diacritics.show = true
  newState.editor.diacritics.key = action.payload
  return newState
}

export const setCursorPosition = (state, action) => {
  const newState = { ...state }
  newState.editor.diacritics.cursorOffset = action.payload
  return newState
}
