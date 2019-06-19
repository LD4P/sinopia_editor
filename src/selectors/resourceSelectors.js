export const rootResource = state => Object.values(state.selectorReducer.resource)[0]

export const rootResourceId = state => rootResource(state)?.resourceURI

export const findNode = (selectorReducer, reduxPath) => {
  const items = reduxPath.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), selectorReducer)

  return items || {}
}

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
