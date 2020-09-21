// Copyright 2019 Stanford University see LICENSE for license

export const selectLiteralInputContent = (state, key) => state.selectorReducer.editor.content[key]

export const displayDiacritics = (state) => state.editor.diacritics.show

export const selectDiacriticsKey = (state) => state.editor.diacritics.key

export const selectDiacriticsCursorOffset = (state) => state.editor.diacritics.cursorOffset

export const noop = () => {}
