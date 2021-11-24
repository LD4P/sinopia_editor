export const clearResource = (resourceKey) => ({
  type: "CLEAR_RESOURCE",
  payload: resourceKey,
})

export const loadResourceFinished = (resourceKey) => ({
  type: "LOAD_RESOURCE_FINISHED",
  payload: resourceKey,
})

export const setBaseURL = (resourceKey, resourceURI) => ({
  type: "SET_BASE_URL",
  payload: { resourceKey, resourceURI },
})

export const saveResourceFinished = (resourceKey) => ({
  type: "SAVE_RESOURCE_FINISHED",
  payload: {
    resourceKey,
    timestamp: Date.now(),
  },
})

export const setCurrentResource = (resourceKey) => ({
  type: "SET_CURRENT_EDIT_RESOURCE",
  payload: resourceKey,
})

export const setCurrentPreviewResource = (resourceKey) => ({
  type: "SET_CURRENT_PREVIEW_RESOURCE",
  payload: resourceKey,
})

export const setCurrentDiff = (compareTo) => ({
  type: "SET_CURRENT_DIFF_RESOURCES",
  payload: compareTo, // Expected: {compareFromResourceKey, compareToResourceKey}
})

export const setResourceGroup = (resourceKey, group, editGroups) => ({
  type: "SET_RESOURCE_GROUP",
  payload: { resourceKey, group, editGroups },
})

export const setUnusedRDF = (resourceKey, rdf) => ({
  type: "SET_UNUSED_RDF",
  payload: { resourceKey, rdf },
})

export const showProperty = (propertyKey) => ({
  type: "SHOW_PROPERTY",
  payload: propertyKey,
})

export const hideProperty = (propertyKey) => ({
  type: "HIDE_PROPERTY",
  payload: propertyKey,
})

export const showNavProperty = (propertyKey) => ({
  type: "SHOW_NAV_PROPERTY",
  payload: propertyKey,
})

export const hideNavProperty = (propertyKey) => ({
  type: "HIDE_NAV_PROPERTY",
  payload: propertyKey,
})

export const showNavSubject = (subjectKey) => ({
  type: "SHOW_NAV_SUBJECT",
  payload: subjectKey,
})

export const hideNavSubject = (subjectKey) => ({
  type: "HIDE_NAV_SUBJECT",
  payload: subjectKey,
})

export const addSubject = (subject) => ({
  type: "ADD_SUBJECT",
  payload: subject,
})

export const addProperty = (property) => ({
  type: "ADD_PROPERTY",
  payload: property,
})

export const addValue = (value, siblingValueKey) => ({
  type: "ADD_VALUE",
  payload: {
    value,
    siblingValueKey,
  },
})

export const updateLiteralValue = (valueKey, literal, lang, component) => ({
  type: "UPDATE_VALUE",
  payload: {
    valueKey,
    literal: literal || null,
    lang: lang || null,
    component,
  },
})

export const updateURIValue = (valueKey, uri, label, lang, component) => ({
  type: "UPDATE_VALUE",
  payload: {
    valueKey,
    uri: uri || null,
    label: label || null,
    lang: lang || null,
    component,
  },
})

export const removeValue = (valueKey) => ({
  type: "REMOVE_VALUE",
  payload: valueKey,
})

export const removeSubject = (subjectKey) => ({
  type: "REMOVE_SUBJECT",
  payload: subjectKey,
})

export const setValueOrder = (valueKey, index) => ({
  type: "SET_VALUE_ORDER",
  payload: {
    valueKey,
    index,
  },
})

export const setVersions = (resourceKey, versions) => ({
  type: "SET_VERSIONS",
  payload: {
    resourceKey,
    versions,
  },
})

export const clearVersions = (resourceKey) => ({
  type: "CLEAR_VERSIONS",
  payload: resourceKey,
})

export const setValuePropertyURI = (valueKey, uri) => ({
  type: "SET_VALUE_PROPERTY_URI",
  payload: {
    valueKey,
    uri,
  },
})

export const setPropertyPropertyURI = (propertyKey, uri) => ({
  type: "SET_PROPERTY_PROPERTY_URI",
  payload: {
    propertyKey,
    uri,
  },
})

export const setClasses = (subjectKey, classes) => ({
  type: "SET_CLASSES",
  payload: {
    subjectKey,
    classes,
  },
})
