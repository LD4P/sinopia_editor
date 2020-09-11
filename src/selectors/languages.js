// Copyright 2019 Stanford University see LICENSE for license

/**
 * Return the full name of the language given the ISO 639 language code
 * @param [Object] state
 * @param [string] languageId the identifier of the language, (e.g. 'eng')
 * @return [string] the label of the language or an empty string
 */
export const selectLanguageLabel = (state, languageId) => {
  const lang = state.selectorReducer.entities.languages.options.find((lang) => lang.id === languageId)
  return lang ? lang.label : ''
}

export const hasLanguages = (state) => {
  state.selectorReducer.entities.languages.options.length > 0
}
