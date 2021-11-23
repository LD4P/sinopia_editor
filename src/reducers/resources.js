import _ from "lodash"
import { emptyValue } from "utilities/Utilities"
import {
  newBlankLiteralValue,
  newBlankUriValue,
  newBlankLookupValue,
  newBlankListValue,
} from "utilities/valueFactory"
import {
  mergeSubjectPropsToNewState,
  mergePropertyPropsToNewState,
  mergeValuePropsToNewState,
  replaceSubjectInNewState,
  replacePropertyInNewState,
  replaceValueInNewState,
  setSubjectChanged,
  updateResourceLabel,
  updateBibframeRefs,
  removeBibframeRefs,
  updateDescWithErrorPropertyKeys,
  updateValueErrors,
  removeFromDescUriOrLiteralValueKeys,
  addToDescUriOrLiteralValueKeys,
  clearSubjectFromNewState,
  clearPropertyFromNewState,
  clearValueFromNewState,
} from "./resourceHelpers"
import { clearRelationships } from "./relationships"
import { resourceEditErrorKey } from "utilities/errorKeyFactory"

export const setBaseURL = (state, action) =>
  mergeSubjectPropsToNewState(state, action.payload.resourceKey, {
    uri: action.payload.resourceURI,
  })

export const showProperty = (state, action) =>
  mergePropertyPropsToNewState(state, action.payload, { show: true })

export const hideProperty = (state, action) =>
  mergePropertyPropsToNewState(state, action.payload, { show: false })

export const showNavProperty = (state, action) =>
  mergePropertyPropsToNewState(state, action.payload, { showNav: true })

export const hideNavProperty = (state, action) =>
  mergePropertyPropsToNewState(state, action.payload, { showNav: false })

export const showNavSubject = (state, action) =>
  mergeSubjectPropsToNewState(state, action.payload, { showNav: true })

export const hideNavSubject = (state, action) =>
  mergeSubjectPropsToNewState(state, action.payload, { showNav: false })

export const loadResourceFinished = (state, action) => {
  let numDefaults = 0
  for (const property of Object.values(state.propertyTemplates)) {
    numDefaults += property.defaults.length
  }
  // if we have any default values, consider this as changed to enable the Save button
  return setSubjectChanged(state, action.payload, numDefaults > 0)
}

export const saveResourceFinishedEditor = (state, action) => ({
  ...state,
  lastSave: {
    ...state.lastSave,
    [action.payload.resourceKey]: action.payload.timestamp,
  },
})

export const saveResourceFinished = (state, action) =>
  setSubjectChanged(state, action.payload.resourceKey, false)

export const setUnusedRDF = (state, action) => ({
  ...state,
  unusedRDF: {
    ...state.unusedRDF,
    [action.payload.resourceKey]: action.payload.rdf,
  },
})

export const setCurrentEditResource = (state, action) => {
  const resourceKey = action.payload
  const newState = {
    ...state,
    currentResource: resourceKey,
  }

  if (resourceKey && !state.resources.includes(resourceKey)) {
    newState.resources = [...state.resources, resourceKey]
  }
  return newState
}

export const setCurrentPreviewResource = (state, action) => {
  const resourceKey = action.payload
  const newState = {
    ...state,
    currentPreviewResource: resourceKey,
  }

  if (resourceKey && !state.resources.includes(resourceKey)) {
    newState.resources = [...state.resources, resourceKey]
  }
  return newState
}

export const setCurrentDiffResources = (state, action) => {
  const { compareToResourceKey, compareFromResourceKey } = action.payload
  const oldDiff = state.currentDiff
  return {
    ...state,
    currentDiff: {
      compareFrom:
        compareFromResourceKey === undefined
          ? oldDiff.compareFrom
          : compareFromResourceKey,
      compareTo:
        compareToResourceKey === undefined
          ? oldDiff.compareTo
          : compareToResourceKey,
    },
  }
}

export const addSubject = (state, action) =>
  addSubjectToNewState(state, action.payload)

const addSubjectToNewState = (state, subject, valueSubjectOfKey) => {
  const newSubject = { ...subject }
  const oldSubject = state.subjects[newSubject.key]

  newSubject.descUriOrLiteralValueKeys = []
  newSubject.descWithErrorPropertyKeys = []

  // Subject template
  if (newSubject.subjectTemplate !== undefined) {
    newSubject.subjectTemplateKey = newSubject.subjectTemplate.key
    delete newSubject.subjectTemplate
  }

  // Add valueSubjectOf. If null, this is a root subject.
  newSubject.valueSubjectOfKey = valueSubjectOfKey || null

  // Show nav
  newSubject.showNav = oldSubject?.showNav || false

  // Add rootSubjectKey, rootPropertyKey, and labels. If this is not a root subject, then need to find from parent.
  const subjectTemplate = state.subjectTemplates[newSubject.subjectTemplateKey]
  if (valueSubjectOfKey) {
    const parentValueSubject = state.values[valueSubjectOfKey]
    newSubject.rootSubjectKey = parentValueSubject.rootSubjectKey
    newSubject.rootPropertyKey = parentValueSubject.rootPropertyKey
    const parentValueSubjectProperty =
      state.properties[parentValueSubject.propertyKey]
    newSubject.labels = [
      ...parentValueSubjectProperty.labels,
      subjectTemplate.label,
    ]
  } else {
    newSubject.rootSubjectKey = newSubject.key
    newSubject.rootPropertyKey = null
    newSubject.labels = [subjectTemplate.label]
  }

  // Add classes if it doesn't already have.
  if (_.isEmpty(newSubject.classes))
    newSubject.classes = [subjectTemplate.class]

  // Add properties for resource (if root subject)
  if (newSubject.rootSubjectKey === newSubject.key) {
    if (_.isUndefined(newSubject.group)) newSubject.group = null
    if (_.isUndefined(newSubject.editGroups)) newSubject.editGroups = []
    if (_.isUndefined(newSubject.bfAdminMetadataRefs))
      newSubject.bfAdminMetadataRefs = []
    if (_.isUndefined(newSubject.localAdminMetadataForRefs))
      newSubject.localAdminMetadataForRefs = []
    if (_.isUndefined(newSubject.bfItemRefs)) newSubject.bfItemRefs = []
    if (_.isUndefined(newSubject.bfInstanceRefs)) newSubject.bfInstanceRefs = []
    if (_.isUndefined(newSubject.bfWorkRefs)) newSubject.bfWorkRefs = []
    newSubject.label = subjectTemplate.label
  }

  const newProperties = newSubject.properties
  if (newProperties) {
    delete newSubject.properties
    newSubject.propertyKeys = []
  }

  let newState = replaceSubjectInNewState(state, newSubject)

  // Remove existing properties
  const oldPropertyKeys = oldSubject?.propertyKeys || []
  oldPropertyKeys.forEach(
    (propertyKey) =>
      (newState = clearPropertyFromNewState(newState, propertyKey))
  )

  // Add new properties
  if (newProperties) {
    newProperties.forEach(
      (property) => (newState = addPropertyToNewState(newState, property))
    )
  }

  return newState
}

export const addProperty = (state, action) =>
  addPropertyToNewState(state, action.payload)

const addPropertyToNewState = (state, property) => {
  const newProperty = { ...property }
  const oldProperty = state.properties[newProperty.key]

  // Subject
  if (newProperty.subject) {
    newProperty.subjectKey = newProperty.subject.key
    delete newProperty.subject
  }

  // Property template
  if (newProperty.propertyTemplate !== undefined) {
    newProperty.propertyTemplateKey = newProperty.propertyTemplate.key
    delete newProperty.propertyTemplate
  }

  newProperty.descUriOrLiteralValueKeys = []
  newProperty.descWithErrorPropertyKeys = []

  // Show nav
  newProperty.showNav = oldProperty?.showNav || false

  // Add root subject, property, and labels from subject
  const oldSubject = state.subjects[newProperty.subjectKey]
  newProperty.rootSubjectKey = oldSubject.rootSubjectKey
  const propertyTemplate =
    state.propertyTemplates[newProperty.propertyTemplateKey]
  newProperty.labels = [...oldSubject.labels, propertyTemplate.label]
  // If subject does not have a root property, then this is a root property.
  newProperty.rootPropertyKey = oldSubject.rootPropertyKey || newProperty.key

  const newValues = newProperty.values
  newProperty.valueKeys = newValues ? [] : null
  delete newProperty.values
  let newState = replacePropertyInNewState(state, newProperty)

  // Add property to subject if doesn't exist.
  if (oldSubject.propertyKeys.indexOf(newProperty.key) === -1) {
    const newPropertyKeys = [...oldSubject.propertyKeys, newProperty.key]
    newState = mergeSubjectPropsToNewState(newState, oldSubject.key, {
      propertyKeys: newPropertyKeys,
    })
  }

  // Remove existing values
  const oldValueKeys = oldProperty?.valueKeys || []
  oldValueKeys.forEach((valueKey) => {
    newState = removeBibframeRefs(newState, newState.values[valueKey])
    newState = clearValueFromNewState(newState, valueKey)
  })

  // Add new values
  if (newValues) {
    newValues.forEach(
      (value) => (newState = addValueToNewState(newState, value))
    )
  }
  // Add a blank first value if necessary.
  newState = addFirstValue(newState, newProperty.key)

  // Errors
  newState = updateDescWithErrorPropertyKeys(newState, newProperty.key)

  return newState
}

export const addValue = (state, action) =>
  addValueToNewState(
    state,
    action.payload.value,
    action.payload.siblingValueKey
  )

const addValueToNewState = (
  state,
  value,
  siblingValueKey = null,
  show = true
) => {
  const newValue = { ...value }
  const oldValue = state.values[newValue.key]

  // Property
  if (newValue.property) {
    newValue.propertyKey = newValue.property.key
    delete newValue.property
  }
  const property = state.properties[newValue.propertyKey]

  // Add root subject and property from property
  newValue.rootSubjectKey = property.rootSubjectKey
  newValue.rootPropertyKey = property.rootPropertyKey

  const newValueSubject = newValue.valueSubject
  if (newValue.valueSubject) {
    newValue.valueSubjectKey = newValue.valueSubject.key
  } else {
    newValue.valueSubjectKey = null
  }
  delete newValue.valueSubject

  // Add value to state
  let newState = replaceValueInNewState(state, newValue)

  // Add value to property
  const newProperty = { ...property }
  const newValueKeys = [...(newProperty.valueKeys || [])]
  // Add if doesn't exist.
  if (newValueKeys.indexOf(newValue.key) === -1) {
    if (siblingValueKey) {
      const index = newProperty.valueKeys.indexOf(siblingValueKey)
      newValueKeys.splice(index + 1, 0, newValue.key)
    } else {
      newValueKeys.push(newValue.key)
    }
    newProperty.valueKeys = newValueKeys
  }
  // Set to show
  newProperty.show = show
  newState = replacePropertyInNewState(newState, newProperty)

  // Update resource label if this is an rdfs:label
  newState = updateResourceLabel(newState, newValue)

  // Remove existing value subject
  if (oldValue?.valueSubjectKey) {
    newState = clearSubjectFromNewState(newState, oldValue.valueSubjectKey)
  }

  if (newValueSubject) {
    // Add new value subject
    newState = addSubjectToNewState(newState, newValueSubject, newValue.key)
  } else if (emptyValue(newValue)) {
    // Remove value key to ancestors (for URIs and literals)
    newState = removeFromDescUriOrLiteralValueKeys(newState, newValue.key)
  } else {
    // Add value key to ancestors (for URIs and literals)
    newState = addToDescUriOrLiteralValueKeys(newState, newValue.key)
  }

  // Errors
  newState = updateValueErrors(newState, newValue.key)
  newState = updateDescWithErrorPropertyKeys(newState, newProperty.key)

  // Update Bibframe refs
  newState = updateBibframeRefs(newState, newValue)

  return newState
}

export const updateValue = (state, action) => {
  const {
    valueKey,
    literal = null,
    lang = null,
    uri = null,
    label = null,
    component = null,
  } = action.payload

  const oldValue = state.values[valueKey]

  const newValue = { ...oldValue, literal, lang, uri, label }
  if (component) newValue.component = component

  let newState = replaceValueInNewState(state, newValue)

  // Add/remove value key to ancestors
  if (emptyValue(newValue)) {
    newState = removeFromDescUriOrLiteralValueKeys(newState, newValue.key)
  } else {
    newState = addToDescUriOrLiteralValueKeys(newState, newValue.key)
  }

  // Errors
  newState = updateValueErrors(newState, valueKey)
  newState = updateDescWithErrorPropertyKeys(newState, newValue.propertyKey)

  // Update Bibframe refs
  newState = updateBibframeRefs(newState, newValue)

  // Update resource label if this is an rdfs:label
  newState = updateResourceLabel(newState, newValue)

  return newState
}

export const removeValue = (state, action) => {
  const value = state.values[action.payload]

  // Remove from property
  const property = { ...state.properties[value.propertyKey] }
  const valueKeys = [...property.valueKeys].filter(
    (valueKey) => valueKey !== value.key
  )
  let newState = mergePropertyPropsToNewState(state, property.key, {
    valueKeys,
  })

  // Errors
  newState = updateValueErrors(newState, value.key)

  newState = removeFromDescUriOrLiteralValueKeys(newState, value.key)

  newState = removeBibframeRefs(newState, value)

  // Recursively remove value
  newState = clearValueFromNewState(newState, value.key)

  // Add a blank value if necessary.
  newState = addFirstValue(newState, property.key)

  return newState
}

export const removeSubject = (state, action) => {
  const subject = state.subjects[action.payload]

  // Recursively remove subject
  let newState = clearSubjectFromNewState(state, subject.key)

  if (subject.rootSubjectKey !== subject.key) {
    newState = setSubjectChanged(newState, subject.rootSubjectKey, true)
  }

  return newState
}

export const clearResourceFromEditor = (state, action) => {
  const resourceKey = action.payload
  const newState = {
    ...state,
    errors: {
      ...state.errors,
    },
    lastSave: {
      ...state.lastSave,
    },
    unusedRDF: {
      ...state.unusedRDF,
    },
  }

  const resourceIndex = state.resources.indexOf(resourceKey)
  newState.resources = [
    ...state.resources.slice(0, resourceIndex),
    ...state.resources.slice(resourceIndex + 1),
  ]

  if (state.currentResource === resourceKey) {
    newState.currentResource = _.first(newState.resources) || null
  }

  delete newState.errors[resourceEditErrorKey(resourceKey)]
  delete newState.lastSave[resourceKey]
  delete newState.unusedRDF[resourceKey]

  return newState
}

export const clearResource = (state, action) => {
  let newState = clearSubjectFromNewState(state, action.payload)
  newState = clearVersions(newState, action)
  return clearRelationships(newState, action)
}

export const setResourceGroup = (state, action) => {
  const props = {
    group: action.payload.group,
    editGroups: [...(action.payload.editGroups || [])],
  }
  return mergeSubjectPropsToNewState(state, action.payload.resourceKey, props)
}

export const setValueOrder = (state, action) => {
  const valueKey = action.payload.valueKey
  const value = state.values[valueKey]

  const newProperty = { ...state.properties[value.propertyKey] }

  const index = action.payload.index
  const filterValueKeys = newProperty.valueKeys.filter(
    (key) => key !== valueKey
  )
  newProperty.valueKeys = [
    ...filterValueKeys.slice(0, index - 1),
    valueKey,
    ...filterValueKeys.slice(index - 1),
  ]

  return replacePropertyInNewState(state, newProperty)
}

const addFirstValue = (state, propertyKey) => {
  const property = state.properties[propertyKey]
  // If no values, add a value.
  if (property.valueKeys === null || !_.isEmpty(property.valueKeys))
    return state
  const propertyTemplate = state.propertyTemplates[property.propertyTemplateKey]
  switch (propertyTemplate.component) {
    case "InputLiteral":
      return addValueToNewState(
        state,
        newBlankLiteralValue(
          property,
          propertyTemplate.languageSuppressed,
          propertyTemplate.defaultUri
        ),
        null,
        propertyTemplate.required
      )
    case "InputURI":
      return addValueToNewState(
        state,
        newBlankUriValue(
          property,
          propertyTemplate.languageSuppressed,
          propertyTemplate.defaultUri
        ),
        null,
        propertyTemplate.required
      )
    case "InputLookup":
      return addValueToNewState(
        state,
        newBlankLookupValue(property, propertyTemplate.defaultUri),
        null,
        propertyTemplate.required
      )
    case "InputList":
      return addValueToNewState(
        state,
        newBlankListValue(property, propertyTemplate.defaultUri),
        null,
        propertyTemplate.required
      )
    default:
      return state
  }
}

// Re-export
export { setSubjectChanged }

export const setVersions = (state, action) => ({
  ...state,
  versions: {
    ...state.versions,
    [action.payload.resourceKey]: action.payload.versions,
  },
})

export const clearVersions = (state, action) => {
  const newVersions = { ...state.versions }
  delete newVersions[action.payload]

  return {
    ...state,
    versions: newVersions,
  }
}

export const setValuePropertyURI = (state, action) => {
  const { valueKey, uri } = action.payload
  return mergeValuePropsToNewState(state, valueKey, { propertyUri: uri })
}

export const setPropertyPropertyURI = (state, action) => {
  const { propertyKey, uri } = action.payload
  return mergePropertyPropsToNewState(state, propertyKey, { propertyUri: uri })
}

export const setClasses = (state, action) => {
  const { subjectKey, classes } = action.payload
  return mergeSubjectPropsToNewState(state, subjectKey, { classes })
}
