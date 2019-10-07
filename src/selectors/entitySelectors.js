// Copyright 2019 Stanford University see LICENSE for license

export const findResourceTemplate = (selectorReducer, resourceTemplateId) => selectorReducer
  .entities.resourceTemplates[resourceTemplateId]

/**
 * Return the full name of the language given the ISO 639 language code
 * @param [Object] state
 * @param [string] languageId the identifier of the language, (e.g. 'en')
 * @return [string] the label of the language or an empty string
 */
export const languageLabel = (state, languageId) => {
  const lang = state.selectorReducer.entities.languages.options.find(lang => lang.id === languageId)
  return lang ? lang.label : ''
}

/**
 * Return lookup based on URI.
 * @param [Object] state
 * @param [string] URI of the lookup
 * @return [Object] the lookup if found
 */
export const findLookup = (state, uri) => state.selectorReducer.entities.lookups[uri]
