// Copyright 2018, 2019 Stanford University see LICENSE for license
export const rootResource = state => Object.values(state.selectorReducer.resource)[0]

export const rootResourceId = state => rootResource(state)?.resourceURI

export const findNode = (selectorReducer, reduxPath) => {
  const items = reduxPath.reduce((obj, key) => obj?.[key], selectorReducer)

  return items || {}
}

export const isExpanded = (selectorReducer, reduxPath) => ['editor', 'expanded', ...reduxPath, 'expanded']
  .reduce((obj, key) => (typeof obj[key] !== 'undefined' ? obj[key] : false), selectorReducer)

export const itemsForProperty = (selectorReducer, reduxPath) => {
  const result = findNode(selectorReducer, reduxPath)

  return result.items || []
}

/*
 * @returns {function} a function that returns true if validations should be displayed
 */
export const getDisplayValidations = state => findNode(state.selectorReducer, ['editor']).displayValidations

/**
 * @returns {function} a function that gets a resource template from state or undefined
 */
export const getResourceTemplate = (state, resourceTemplateId) => findNode(state.selectorReducer, ['entities', 'resourceTemplates'])[resourceTemplateId]


/**
 * @returns {function} a function that gets a property template from state or undefined
 */
export const getPropertyTemplate = (state, resourceTemplateId, propertyURI) => {
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)

  if (!resourceTemplate) {
    return
  }

  // Find the property template
  return resourceTemplate.propertyTemplates.find(propertyTemplate => propertyTemplate.propertyURI === propertyURI)
}
