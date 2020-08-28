export const clearResource = (resourceKey) => ({
  type: 'CLEAR_RESOURCE',
  payload: resourceKey,
})

export const loadResourceFinished = (resourceKey) => ({
  type: 'LOAD_RESOURCE_FINISHED',
  payload: resourceKey,
})

export const setBaseURL = (resourceKey, resourceURI) => ({
  type: 'SET_BASE_URL',
  payload: { resourceKey, resourceURI },
})

export const saveResourceFinished = (resourceKey) => ({
  type: 'SAVE_RESOURCE_FINISHED',
  payload: resourceKey,
})

export const setCurrentResource = (resourceKey) => ({
  type: 'SET_CURRENT_RESOURCE',
  payload: resourceKey,
})

export const setResourceGroup = (resourceKey, group) => ({
  type: 'SET_RESOURCE_GROUP',
  payload: { resourceKey, group },
})

export const setUnusedRDF = (resourceKey, rdf) => ({
  type: 'SET_UNUSED_RDF',
  payload: { resourceKey, rdf },
})

export const showProperty = (propertyKey) => ({
  type: 'SHOW_PROPERTY',
  payload: propertyKey,
})

export const hideProperty = (propertyKey) => ({
  type: 'HIDE_PROPERTY',
  payload: propertyKey,
})

export const addSubject = (subject) => ({
  type: 'ADD_SUBJECT',
  payload: subject,
})

export const addProperty = (property) => ({
  type: 'ADD_PROPERTY',
  payload: property,
})

export const addValue = (value, siblingValueKey) => ({
  type: 'ADD_VALUE',
  payload: {
    value,
    siblingValueKey,
  },
})

export const removeValue = (valueKey) => ({
  type: 'REMOVE_VALUE',
  payload: valueKey,
})

export const removeSubject = (subjectKey) => ({
  type: 'REMOVE_SUBJECT',
  payload: subjectKey,
})

export const removeProperty = (propertyKey) => ({
  type: 'REMOVE_PROPERTY',
  payload: propertyKey,
})
