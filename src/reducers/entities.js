// Copyright 2019 Stanford University see LICENSE for license

/**
 * These are the reducers that effect the 'entities' redux store.
 */

export const setResourceTemplate = (state, action) => {
  const resourceTemplateId = action.payload.id
  const newState = { ...state }

  newState.entities.resourceTemplates[resourceTemplateId] = action.payload

  return newState
}

export const clearResourceTemplates = (state) => {
  const newState = { ...state }

  newState.entities.resourceTemplates = {}

  return newState
}

export const setResourceTemplateSummary = (state, action) => {
  const resourceTemplateId = action.payload.id
  const newState = { ...state }

  newState.entities.resourceTemplateSummaries[resourceTemplateId] = action.payload

  return newState
}

export const loadingLanguages = (state) => {
  const newState = { ...state }
  newState.entities.languages = { loading: true }
  return newState
}

export const languagesReceived = (state, action) => {
  const newState = { ...state }
  newState.entities.languages = { loading: false, options: createOptions(action.payload) }
  return newState
}

const createOptions = json => json.reduce((result, item) => {
  // Object.getOwnPropertyDescriptor is necessary to handle the @
  const id = Object.getOwnPropertyDescriptor(item, '@id').value.replace('http://id.loc.gov/vocabulary/iso639-1/', '')
  const labelArrayDescr = Object.getOwnPropertyDescriptor(item, 'http://www.loc.gov/mads/rdf/v1#authoritativeLabel')

  // Some of the LOC items do not have labels so ignore them.
  if (!labelArrayDescr) return result
  const labelArray = labelArrayDescr.value

  let label = null

  // Looking for English label
  labelArray.forEach((langItem) => {
    if (langItem['@language'] === 'en') {
      label = langItem['@value']
    }
  })
  // But not every language has an English label.
  if (!label) return result

  result.push({ id, label })
  return result
}, [])
