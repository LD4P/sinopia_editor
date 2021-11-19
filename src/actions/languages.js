export const languageSelected = (valueKey, lang) => ({
  type: "LANGUAGE_SELECTED",
  payload: { valueKey, lang },
})

export const languagesReceived = (
  languages,
  languageLookup,
  scripts,
  scriptLookup,
  transliterations,
  transliterationLookup
) => ({
  type: "LANGUAGES_RECEIVED",
  payload: {
    languages,
    languageLookup,
    scripts,
    scriptLookup,
    transliterations,
    transliterationLookup,
  },
})
