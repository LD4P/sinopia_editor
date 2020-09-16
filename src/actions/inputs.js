export const hideDiacritics = () => ({
  type: 'HIDE_DIACRITICS',
})

export const setLiteralContent = (key, literal) => ({
  type: 'SET_LITERAL_CONTENT',
  payload: { key, literal },
})

export const showDiacritics = (propertyKey) => ({
  type: 'SHOW_DIACRITICS',
  payload: propertyKey,
})

export const updateCursorPosition = (position) => ({
  type: 'SET_CURSOR_POSITION',
  payload: position,
})
