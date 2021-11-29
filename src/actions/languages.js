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

export const setDefaultLang = (resourceKey, lang) => ({
  type: "SET_DEFAULT_LANG",
  payload: { resourceKey, lang },
})
