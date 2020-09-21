// Copyright 2018, 2019 Stanford University see LICENSE for license
export const setLiteralInputContent = (state, action) => ({
  ...state,
  content: {
    ...state.content,
    [action.payload.key]: action.payload.literal,
  },
})

export const hideDiacriticsSelection = (state) => ({
  ...state,
  diacritics: {
    show: false,
    key: null,
    cursorOffset: null,
  },
})

export const showDiacriticsSelection = (state, action) => ({
  ...state,
  diacritics: {
    ...state.diacritics,
    show: true,
    key: action.payload,
  },
})

export const setCursorPosition = (state, action) => ({
  ...state,
  diacritics: {
    ...state.diacritics,
    cursorOffset: action.payload,
  },
})
