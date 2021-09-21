export const languageSelected = (valueKey, lang) => ({
  type: "LANGUAGE_SELECTED",
  payload: { valueKey, lang },
})

export const languagesReceived = (languages) => ({
  type: "LANGUAGES_RECEIVED",
  payload: languages,
})
