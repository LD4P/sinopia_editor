import _ from "lodash"
import { resourceEditErrorKey } from "components/editor/Editor"
import { emptyValue, isValidURI } from "utilities/Utilities"
import {
  newBlankLiteralValue,
  newBlankUriValue,
  newBlankLookupValue,
  newBlankListValue,
} from "utilities/valueFactory"

export const setBaseURL = (state, action) => {
  const newState = stateWithNewSubject(state, action.payload.resourceKey)
  newState.subjects[action.payload.resourceKey].uri = action.payload.resourceURI

  return newState
}

export const showProperty = (state, action) => {
  const newState = stateWithNewProperty(state, action.payload)
  newState.properties[action.payload].show = true

  return newState
}

export const hideProperty = (state, action) => {
  const newState = stateWithNewProperty(state, action.payload)
  newState.properties[action.payload].show = false

  return newState
}

export const loadResourceFinished = (state, action) =>
  setSubjectChanged(state, action.payload, false)

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

export const setCurrentResource = (state, action) => {
  const resourceKey = action.payload
  const newState = {
    ...state,
    currentResource: resourceKey,
  }

  if (state.resources.indexOf(resourceKey) === -1) {
    newState.resources = [...state.resources, resourceKey]
  }
  return newState
}

export const setCurrentResourceIsReadOnly = (state, action) => ({
  ...state,
  currentResourceIsReadOnly: action.payload,
})

export const addSubject = (state, action) =>
  addSubjectToNewState(state, _.cloneDeep(action.payload))

const addSubjectToNewState = (state, subject, valueSubjectOfKey) => {
  // Subject is already deep copied.
  let newSubject = subject

  // Add subject to state
  let newState = stateWithNewSubject(state, newSubject.key)
  newState.subjects[newSubject.key] = newSubject

  newSubject.descUriOrLiteralValueKeys = []
  newSubject.descWithErrorPropertyKeys = []

  // Subject template
  if (newSubject.subjectTemplate !== undefined) {
    newSubject.subjectTemplateKey = newSubject.subjectTemplate.key
    delete newSubject.subjectTemplate
  }

  // Add valueSubjectOf. If null, this is a root subject.
  newSubject.valueSubjectOfKey = valueSubjectOfKey || null

  // Add rootSubjectKey, rootPropertyKey, and labels. If this is not a root subject, then need to find from parent.
  const subjectTemplate =
    newState.subjectTemplates[newSubject.subjectTemplateKey]
  if (valueSubjectOfKey) {
    const parentValueSubject = newState.values[valueSubjectOfKey]
    newSubject.rootSubjectKey = parentValueSubject.rootSubjectKey
    newSubject.rootPropertyKey = parentValueSubject.rootPropertyKey
    const parentValueSubjectProperty =
      newState.properties[parentValueSubject.propertyKey]
    newSubject.labels = [
      ...parentValueSubjectProperty.labels,
      subjectTemplate.label,
    ]
  } else {
    newSubject.rootSubjectKey = newSubject.key
    newSubject.rootPropertyKey = null
    newSubject.labels = [subjectTemplate.label]
  }

  // Add properties for resource (if root subject)
  if (newSubject.rootSubjectKey === newSubject.key) {
    if (_.isUndefined(newSubject.group)) newSubject.group = null
    if (_.isUndefined(newSubject.editGroups)) newSubject.editGroups = []
    if (_.isUndefined(newSubject.bfAdminMetadataRefs))
      newSubject.bfAdminMetadataRefs = []
    if (_.isUndefined(newSubject.bfItemRefs)) newSubject.bfItemRefs = []
    if (_.isUndefined(newSubject.bfInstanceRefs)) newSubject.bfInstanceRefs = []
    if (_.isUndefined(newSubject.bfWorkRefs)) newSubject.bfWorkRefs = []
    newSubject.label = subjectTemplate.label
  }

  const oldSubject = state.subjects[newSubject.key]
  if (newSubject.properties !== undefined) {
    // Remove existing properties
    const oldPropertyKeys = oldSubject?.propertyKeys || []
    oldPropertyKeys.forEach(
      (propertyKey) =>
        (newState = clearPropertyFromNewState(newState, propertyKey))
    )

    // Add new properties
    newSubject.propertyKeys = []
    newSubject.properties.forEach(
      (property) => (newState = addPropertyToNewState(newState, property))
    )
    // Get a new reference to subject.
    newSubject = newState.subjects[subject.key]
    delete newSubject.properties
  }

  // If changed, then set resource as changed.
  if (!_.isEqual(newSubject, oldSubject)) {
    newState = setSubjectChanged(newState, newSubject.rootSubjectKey, true)
  }

  return newState
}

export const addProperty = (state, action) =>
  addPropertyToNewState(state, _.cloneDeep(action.payload))

const addPropertyToNewState = (state, property) => {
  // Property has already been deep copied.
  let newProperty = property

  // Add property to state
  let newState = {
    ...state,
    properties: {
      ...state.properties,
      [newProperty.key]: newProperty,
    },
  }
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

  // Add root subject, property, and labels from subject
  const oldSubject = state.subjects[newProperty.subjectKey]
  newProperty.rootSubjectKey = oldSubject.rootSubjectKey
  const propertyTemplate =
    newState.propertyTemplates[newProperty.propertyTemplateKey]
  newProperty.labels = [...oldSubject.labels, propertyTemplate.label]
  // If subject does not have a root property, then this is a root property.
  newProperty.rootPropertyKey = oldSubject.rootPropertyKey || newProperty.key

  // Add property to subject
  newState = stateWithNewSubject(newState, newProperty.subjectKey)
  const newSubject = newState.subjects[newProperty.subjectKey]
  // Add if doesn't exist.
  if (newSubject.propertyKeys.indexOf(newProperty.key) === -1) {
    newSubject.propertyKeys = [...newSubject.propertyKeys, newProperty.key]
  }

  // Remove existing values
  const oldValueKeys = oldProperty?.valueKeys || []
  oldValueKeys.forEach((valueKey) => {
    newState = removeBibframeRefs(
      newState,
      newState.values[valueKey],
      oldProperty
    )
    newState = clearValueFromNewState(newState, valueKey)
  })

  // Add new values
  newProperty = newState.properties[newProperty.key]
  if (newProperty.values) {
    newProperty.valueKeys = []
    newProperty.values.forEach(
      (value) => (newState = addValueToNewState(newState, value))
    )
  } else {
    newProperty.valueKeys = null
  }
  newProperty = newState.properties[newProperty.key]
  delete newProperty.values

  // Add a blank first value if necessary.
  newState = addFirstValue(newState, newProperty)
  newProperty = newState.properties[newProperty.key]

  // Errors
  newState = updateDescWithErrorPropertyKeys(newState, newProperty.key)
  newProperty = newState.properties[newProperty.key]

  // If changed, then set resource as changed.
  if (!_.isEqual(newProperty, oldProperty)) {
    newState = setSubjectChanged(newState, newProperty.rootSubjectKey, true)
  }
  return newState
}

export const addValue = (state, action) =>
  addValueToNewState(
    state,
    _.cloneDeep(action.payload.value),
    action.payload.siblingValueKey
  )

const addValueToNewState = (
  state,
  value,
  siblingValueKey = null,
  show = true
) => {
  let newValue = value

  // Property
  if (newValue.property) {
    newValue.propertyKey = newValue.property.key
    delete newValue.property
  }

  // langLabel
  delete newValue.langLabel

  // Add value to state
  let newState = stateWithNewValue(state, newValue.key)
  newState.values[newValue.key] = newValue

  // Add value to property
  newState = stateWithNewProperty(newState, newValue.propertyKey)
  let newProperty = newState.properties[newValue.propertyKey]
  const valueKeys = newProperty.valueKeys || []
  // Add if doesn't exist.
  if (valueKeys.indexOf(newValue.key) === -1) {
    if (siblingValueKey) {
      const index = newProperty.valueKeys.indexOf(siblingValueKey)
      newProperty.valueKeys.splice(index + 1, 0, newValue.key)
    } else {
      newProperty.valueKeys = [...valueKeys, newValue.key]
    }
  }
  // Set to show
  newProperty.show = show

  // Add root subject and property from property
  newValue = newState.values[newValue.key]
  newValue.rootSubjectKey = newProperty.rootSubjectKey
  newValue.rootPropertyKey = newProperty.rootPropertyKey

  newState = updateResourceLabel(newState, newValue)

  // Remove existing value subject
  const oldValue = state.values[newValue.key]
  if (oldValue?.valueSubjectKey) {
    newState = clearSubjectFromNewState(newState, oldValue.valueSubjectKey)
  }

  // Add new value subject
  if (newValue.valueSubject !== undefined) {
    newValue = newState.values[newValue.key]
    if (newValue.valueSubject) {
      newValue.valueSubjectKey = newValue.valueSubject.key
      newState = addSubjectToNewState(
        newState,
        newValue.valueSubject,
        newValue.key
      )
    } else {
      newValue.valueSubjectKey = null
    }
    newValue = newState.values[newValue.key]
    delete newValue.valueSubject
  }

  // Add/remove value key to ancestors (for URIs and literals)
  if (!newValue.valueSubjectKey) {
    newState = recursiveAncestorsFromValue(
      newState,
      newValue.key,
      emptyValue(newValue)
        ? removeFromDescUriOrLiteralValueKeysFunc(newValue.key)
        : addToDescUriOrLiteralValueKeysFunc(newValue.key)
    )
  }

  // Errors
  newState = updateValueErrors(newState, newValue.key)
  newState = updateDescWithErrorPropertyKeys(newState, newProperty.key)
  newValue = newState.values[newValue.key]
  newProperty = newState.properties[newValue.propertyKey]

  // Update Bibframe refs
  newState = updateBibframeRefs(newState, newValue, newProperty)

  // If changed, then set resource as changed.
  newValue = newState.values[newValue.key]
  // Preventing marking changed when adding a blank value.
  if (!_.isEqual(newValue, oldValue) && (oldValue || !emptyValue(newValue))) {
    newState = setSubjectChanged(newState, newValue.rootSubjectKey, true)
  }
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

  // Add value to state
  let newState = stateWithNewValue(state, valueKey)
  let newValue = { ...oldValue, literal, lang, uri, label }
  if (component) newValue.component = component
  newState.values[valueKey] = newValue

  // Add/remove value key to ancestors
  newState = recursiveAncestorsFromValue(
    newState,
    newValue.key,
    emptyValue(newValue)
      ? removeFromDescUriOrLiteralValueKeysFunc(newValue.key)
      : addToDescUriOrLiteralValueKeysFunc(newValue.key)
  )

  // Errors
  newState = updateValueErrors(newState, valueKey)
  newState = updateDescWithErrorPropertyKeys(newState, newValue.propertyKey)

  // Update Bibframe refs
  newValue = newState.values[valueKey]
  const newProperty = newState.properties[newValue.propertyKey]
  newState = updateBibframeRefs(newState, newValue, newProperty)

  newState = updateResourceLabel(newState, newValue)

  // If changed, then set resource as changed.
  newValue = newState.values[newValue.key]
  if (!_.isEqual(newValue, oldValue)) {
    newState = setSubjectChanged(newState, newValue.rootSubjectKey, true)
  }

  return newState
}

// add rdfs:label to root resource if it's present
const updateResourceLabel = (state, value) => {
  const possibleLabelProperty = state.properties[value.propertyKey]
  const propertyTemplate =
    state.propertyTemplates[possibleLabelProperty.propertyTemplateKey]
  const rootSubjectKey = possibleLabelProperty.rootSubjectKey
  if (
    propertyTemplate.uri === "http://www.w3.org/2000/01/rdf-schema#label" &&
    possibleLabelProperty.subjectKey === rootSubjectKey
  ) {
    const labelValue = value.literal || possibleLabelProperty.labels[0]
    const newState = stateWithNewSubject(state, rootSubjectKey)
    const newResourceSubject = newState.subjects[rootSubjectKey]
    newResourceSubject.label = labelValue
    return newState
  }
  return state
}

const updateBibframeRefs = (state, value, property) => {
  if (!value.uri) return state
  const propertyTemplate = state.propertyTemplates[property.propertyTemplateKey]
  const newState = stateWithNewSubject(state, value.rootSubjectKey)
  const newSubject = newState.subjects[value.rootSubjectKey]

  switch (propertyTemplate.uri) {
    case "http://id.loc.gov/ontologies/bibframe/adminMetadata":
      // References admin metadata
      addToKeyArray(newSubject, "bfAdminMetadataRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/itemOf":
      // References instance
      addToKeyArray(newSubject, "bfInstanceRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/hasItem":
      // References item
      addToKeyArray(newSubject, "bfItemRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/instanceOf":
      // References work
      addToKeyArray(newSubject, "bfWorkRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/hasInstance":
      // References instance
      addToKeyArray(newSubject, "bfInstanceRefs", value.uri)
      break
    default:
    // Nothing
  }

  return newState
}

const addToKeyArray = (obj, key, value) => {
  if (!obj[key].includes(value)) {
    obj[key] = [...obj[key], value]
  }
}

export const removeValue = (state, action) => {
  const value = state.values[action.payload]

  // Remove from property
  let newState = stateWithNewProperty(state, value.propertyKey)
  const newProperty = newState.properties[value.propertyKey]
  newProperty.valueKeys = [...newProperty.valueKeys].filter(
    (valueKey) => valueKey !== value.key
  )

  // Errors
  newState = updateValueErrors(newState, value.key)

  newState = recursiveAncestorsFromValue(
    newState,
    value.key,
    removeFromDescUriOrLiteralValueKeysFunc(value.key)
  )

  newState = removeBibframeRefs(newState, value, newProperty)

  // Recursively remove value
  newState = clearValueFromNewState(newState, value.key)

  // Set resource as changed
  newState = setSubjectChanged(newState, value.rootSubjectKey, true)

  // Add a blank value if necessary.
  newState = addFirstValue(newState, newProperty)

  return newState
}

const addFirstValue = (state, property) => {
  // For URI and Literal component, if no values, add a value.
  // Eventually, this will apply to other components as well.

  if (property.valueKeys === null || !_.isEmpty(property.valueKeys))
    return state
  const propertyTemplate = state.propertyTemplates[property.propertyTemplateKey]
  switch (propertyTemplate.component) {
    case "InputLiteral":
      return addValueToNewState(
        state,
        newBlankLiteralValue(property),
        null,
        propertyTemplate.required
      )
    case "InputURI":
      return addValueToNewState(
        state,
        newBlankUriValue(property),
        null,
        propertyTemplate.required
      )
    case "InputLookup":
      return addValueToNewState(
        state,
        newBlankLookupValue(property),
        null,
        propertyTemplate.required
      )
    case "InputList":
      return addValueToNewState(
        state,
        newBlankListValue(property),
        null,
        propertyTemplate.required
      )
    default:
      return state
  }
}

const removeBibframeRefs = (state, value, property) => {
  if (!value.uri) return state

  const propertyTemplate = state.propertyTemplates[property.propertyTemplateKey]
  const newState = stateWithNewSubject(state, value.rootSubjectKey)
  const newSubject = newState.subjects[value.rootSubjectKey]
  switch (propertyTemplate.uri) {
    case "http://id.loc.gov/ontologies/bibframe/adminMetadata":
      // References admin metadata
      removeFromKeyArray(newSubject, "bfAdminMetadataRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/itemOf":
      // References instance
      removeFromKeyArray(newSubject, "bfInstanceRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/hasItem":
      // References item
      removeFromKeyArray(newSubject, "bfItemRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/instanceOf":
      // References work
      removeFromKeyArray(newSubject, "bfWorkRefs", value.uri)
      break
    case "http://id.loc.gov/ontologies/bibframe/hasInstance":
      // References instance
      removeFromKeyArray(newSubject, "bfInstanceRefs", value.uri)
      break
    default:
    // Nothing
  }
  return newState
}

const removeFromKeyArray = (obj, key, value) => {
  if (!obj[key].includes(value)) return
  obj[key] = [...obj[key]].filter((checkValue) => checkValue !== value)
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

const errorsForValue = (value, state) => {
  const property = state.properties[value.propertyKey]
  const propertyTemplate = state.propertyTemplates[property.propertyTemplateKey]
  // If this is first value, then must have a value.
  const errors = []
  if (
    value.key === property.valueKeys[0] &&
    propertyTemplate.required &&
    propertyTemplate.type === "literal" &&
    !value.literal
  )
    errors.push("Literal required")

  if (propertyTemplate.type === "uri") {
    if (value.key === property.valueKeys[0] && propertyTemplate.required) {
      if (!value.uri) errors.push("URI required")
      if (!value.label) errors.push("Label required")
    } else {
      if (value.uri && !value.label) errors.push("Label required")
      if (!value.uri && value.label) errors.push("URI required")
    }
    if (value.uri && !isValidURI(value.uri)) errors.push("Invalid URI")
  }

  return errors
}

const updateDescWithErrorPropertyKeys = (state, propertyKey) => {
  if (propertyHasErrors(state, propertyKey)) {
    // Add key to descWithErrorPropertyKeys for self and ancestors.
    return recursiveAncestorsFromProperty(
      state,
      propertyKey,
      addToDescWithErrorPropertyKeysFunc(propertyKey)
    )
  }
  // Remove key from descWithErrorPropertyKeys for self and ancestors.
  return recursiveAncestorsFromProperty(
    state,
    propertyKey,
    removeFromDescWithErrorPropertyKeysFunc(propertyKey)
  )
}

const propertyHasErrors = (state, propertyKey) => {
  const property = state.properties[propertyKey]

  if (!_.isEmpty(property.errors)) return true
  if (property.valueKeys === null) return false
  return property.valueKeys.some((valueKey) => {
    const value = state.values[valueKey]
    return !_.isEmpty(value?.errors)
  })
}

const updateValueErrors = (state, valueKey) => {
  const newState = stateWithNewValue(state, valueKey)
  const newValue = newState.values[valueKey]
  newValue.errors = errorsForValue(newValue, newState)

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

export const clearResource = (state, action) =>
  clearSubjectFromNewState(state, action.payload)

const clearSubjectFromNewState = (state, subjectKey) => {
  const subject = state.subjects[subjectKey]
  let newState = state
  subject.propertyKeys.forEach(
    (propertyKey) =>
      (newState = clearPropertyFromNewState(newState, propertyKey))
  )
  delete newState.subjects[subjectKey]

  return newState
}

const clearPropertyFromNewState = (state, propertyKey) => {
  const property = state.properties[propertyKey]
  let newState = state
  if (!_.isEmpty(property.valueKeys)) {
    property.valueKeys.forEach(
      (valueKey) => (state = clearValueFromNewState(newState, valueKey))
    )
  }

  // Remove error from ancestors
  newState = recursiveAncestorsFromProperty(
    newState,
    propertyKey,
    removeFromDescWithErrorPropertyKeysFunc(propertyKey)
  )

  delete newState.properties[propertyKey]

  return newState
}

const clearValueFromNewState = (state, valueKey) => {
  const value = state.values[valueKey]
  let newState = state
  if (value.valueSubjectKey)
    newState = clearSubjectFromNewState(newState, value.valueSubjectKey)

  // Remove value key from ancestors' descUriOrLiteralValueKeys
  newState = recursiveAncestorsFromValue(
    newState,
    valueKey,
    removeFromDescUriOrLiteralValueKeysFunc(valueKey)
  )

  delete newState.values[valueKey]

  return newState
}

export const setResourceGroup = (state, action) => {
  const newState = stateWithNewSubject(state, action.payload.resourceKey)
  const newSubject = newState.subjects[action.payload.resourceKey]
  newSubject.group = action.payload.group
  newSubject.editGroups = [...(action.payload.editGroups || [])]

  return newState
}

export const setValueOrder = (state, action) => {
  const valueKey = action.payload.valueKey
  const value = state.values[valueKey]

  let newState = stateWithNewProperty(state, value.propertyKey)
  const newProperty = newState.properties[value.propertyKey]

  // Set resource as changed if order changed (this enables the save button)
  newState = setSubjectChanged(newState, newProperty.subjectKey, true)

  const index = action.payload.index
  const filterValueKeys = newProperty.valueKeys.filter(
    (key) => key !== valueKey
  )
  newProperty.valueKeys = [
    ...filterValueKeys.slice(0, index - 1),
    valueKey,
    ...filterValueKeys.slice(index - 1),
  ]

  return newState
}

const stateWithNewSubject = (state, subjectKey) => ({
  ...state,
  subjects: {
    ...state.subjects,
    [subjectKey]: {
      ...state.subjects[subjectKey],
    },
  },
})

const stateWithNewProperty = (state, propertyKey) => ({
  ...state,
  properties: {
    ...state.properties,
    [propertyKey]: {
      ...state.properties[propertyKey],
    },
  },
})

const stateWithNewValue = (state, valueKey) => ({
  ...state,
  values: {
    ...state.values,
    [valueKey]: {
      ...state.values[valueKey],
    },
  },
})

export const setSubjectChanged = (state, subjectKey, changed) => {
  const newState = stateWithNewSubject(state, subjectKey)
  newState.subjects[subjectKey].changed = changed

  return newState
}

const recursiveAncestorsFromSubject = (state, subjectKey, performFunc) => {
  let newState = stateWithNewSubject(state, subjectKey)
  newState = performFunc(state, newState, newState.subjects[subjectKey])

  const subject = state.subjects[subjectKey]
  if (!subject.valueSubjectOfKey) return newState
  return recursiveAncestorsFromValue(
    newState,
    subject.valueSubjectOfKey,
    performFunc
  )
}

const recursiveAncestorsFromValue = (state, valueKey, performFunc) => {
  let newState = stateWithNewValue(state, valueKey)
  newState = performFunc(state, newState, newState.values[valueKey])

  const value = state.values[valueKey]
  return recursiveAncestorsFromProperty(
    newState,
    value.propertyKey,
    performFunc
  )
}

const recursiveAncestorsFromProperty = (state, propertyKey, performFunc) => {
  let newState = stateWithNewProperty(state, propertyKey)
  newState = performFunc(state, newState, newState.properties[propertyKey])

  const property = state.properties[propertyKey]
  return recursiveAncestorsFromSubject(
    newState,
    property.subjectKey,
    performFunc
  )
}

const removeFromDescWithErrorPropertyKeysFunc =
  (propertyKey) => (state, newState, newObj) => {
    if (
      newObj.descWithErrorPropertyKeys === undefined ||
      !newObj.descWithErrorPropertyKeys.includes(propertyKey)
    )
      return state
    newObj.descWithErrorPropertyKeys = [
      ...newObj.descWithErrorPropertyKeys,
    ].filter((checkPropertyKey) => propertyKey !== checkPropertyKey)
    return newState
  }

const addToDescWithErrorPropertyKeysFunc =
  (propertyKey) => (state, newState, newObj) => {
    if (
      newObj.descWithErrorPropertyKeys === undefined ||
      newObj.descWithErrorPropertyKeys.includes(propertyKey)
    )
      return state
    newObj.descWithErrorPropertyKeys = [
      ...newObj.descWithErrorPropertyKeys,
      propertyKey,
    ]
    return newState
  }

const removeFromDescUriOrLiteralValueKeysFunc =
  (valueKey) => (state, newState, newObj) => {
    if (
      newObj.descUriOrLiteralValueKeys === undefined ||
      !newObj.descUriOrLiteralValueKeys.includes(valueKey)
    )
      return state
    newObj.descUriOrLiteralValueKeys = [
      ...newObj.descUriOrLiteralValueKeys,
    ].filter((checkValueKey) => valueKey !== checkValueKey)
    return newState
  }

const addToDescUriOrLiteralValueKeysFunc =
  (valueKey) => (state, newState, newObj) => {
    if (
      newObj.descUriOrLiteralValueKeys === undefined ||
      newObj.descUriOrLiteralValueKeys.includes(valueKey)
    )
      return state
    newObj.descUriOrLiteralValueKeys = [
      ...newObj.descUriOrLiteralValueKeys,
      valueKey,
    ]
    return newState
  }
