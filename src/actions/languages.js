export const languageSelected = (valueKey, lang) => ({
  type: 'LANGUAGE_SELECTED',
  payload: { valueKey, lang },
})

export const languagesReceived = (json) => ({
  type: 'LANGUAGES_RECEIVED',
  payload: json,
})

export const fetchingLanguages = () => ({
  type: 'FETCHING_LANGUAGES',
})
