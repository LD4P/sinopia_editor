import { emptyValue } from "utilities/Utilities"
import {
  literalRequiredError,
  literalRegexValidationError,
  literalIntegerValidationError,
  literalDateTimeValidationError,
  literalDateTimeStampValidationError,
  literalEdtfValidationError,
  uriPropertiesAndValueErrors,
} from "./resourceValidationHelpers"
import _ from "lodash"

export const mergeSubjectPropsToNewState = (state, subjectKey, props) => {
  const oldSubject = state.subjects[subjectKey]

  return replaceSubjectInNewState(state, { ...oldSubject, ...props })
}

export const mergePropertyPropsToNewState = (state, propertyKey, props) => {
  const oldProperty = state.properties[propertyKey]

  return replacePropertyInNewState(state, { ...oldProperty, ...props })
}

export const mergeValuePropsToNewState = (state, valueKey, props) => {
  const oldValue = state.values[valueKey]

  return replaceValueInNewState(state, { ...oldValue, ...props })
}

export const replaceSubjectInNewState = (state, subject) => {
  const oldSubject = state.subjects[subject.key]

  if (_.isEqual(oldSubject, subject)) return state

  const newState = {
    ...state,
    subjects: {
      ...state.subjects,
      [subject.key]: subject,
    },
  }

  if (unchanged(oldSubject, subject)) return newState

  return setSubjectChanged(newState, subject.rootSubjectKey, true)
}

export const replacePropertyInNewState = (state, property) => {
  const oldProperty = state.properties[property.key]

  if (_.isEqual(oldProperty, property)) return state

  const newState = {
    ...state,
    properties: {
      ...state.properties,
      [property.key]: property,
    },
  }

  if (unchanged(oldProperty, property)) return newState

  return setSubjectChanged(newState, property.rootSubjectKey, true)
}

export const replaceValueInNewState = (state, value) => {
  const oldValue = state.values[value.key]

  if (_.isEqual(oldValue, value)) return state

  const newState = {
    ...state,
    values: {
      ...state.values,
      [value.key]: value,
    },
  }

  // Preventing marking changed when adding a blank value.
  if (unchanged(oldValue, value) || !oldValue || emptyValue(value))
    return newState

  return setSubjectChanged(newState, value.rootSubjectKey, true)
}

const unchanged = (oldObj, newObj) =>
  _.isEqual(cleanObj(oldObj), cleanObj(newObj))

const cleanObj = (obj) => {
  if (!obj) return obj
  const fields = ["show", "showNav", "changed"]
  // Omit uri for subject, but not values.
  if (obj.subjectTemplateKey) fields.push("uri")
  return _.omit(obj, fields)
}

export const setSubjectChanged = (state, subjectKey, changed) =>
  mergeSubjectPropsToNewState(state, subjectKey, { changed })

// add rdfs:label to root resource if it's present
export const updateResourceLabel = (state, value) => {
  const possibleLabelProperty = state.properties[value.propertyKey]
  const propertyTemplate =
    state.propertyTemplates[possibleLabelProperty.propertyTemplateKey]
  const rootSubjectKey = possibleLabelProperty.rootSubjectKey
  if (
    propertyTemplate.defaultUri ===
      "http://www.w3.org/2000/01/rdf-schema#label" &&
    possibleLabelProperty.subjectKey === rootSubjectKey
  ) {
    const labelValue = value.literal || possibleLabelProperty.labels[0]
    return mergeSubjectPropsToNewState(state, rootSubjectKey, {
      label: labelValue,
    })
  }
  return state
}

export const updateBibframeRefs = (state, value) => {
  if (!value.uri) return state
  const newSubject = { ...state.subjects[value.rootSubjectKey] }
  switch (value.propertyUri) {
    case "http://id.loc.gov/ontologies/bibframe/adminMetadata":
      // References admin metadata
      addToKeyArray(newSubject, "bfAdminMetadataRefs", value.uri)
      break
    case "http://sinopia.io/vocabulary/localAdminMetadataFor":
      // References Sinopia localadmin metadata
      addToKeyArray(newSubject, "localAdminMetadataForRefs", value.uri)
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

  return replaceSubjectInNewState(state, newSubject)
}

const addToKeyArray = (obj, key, value) => {
  if (!obj[key].includes(value)) {
    obj[key] = [...obj[key], value]
  }
}

export const removeBibframeRefs = (state, value) => {
  if (!value.uri) return state

  const newSubject = { ...state.subjects[value.rootSubjectKey] }
  switch (value.propertyUri) {
    case "http://id.loc.gov/ontologies/bibframe/adminMetadata":
      // References admin metadata
      removeFromKeyArray(newSubject, "bfAdminMetadataRefs", value.uri)
      break
    case "http://sinopia.io/vocabulary/localAdminMetadataFor":
      // References Sinopia localadmin metadata
      removeFromKeyArray(newSubject, "localAdminMetadataForRefs", value.uri)
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
  return replaceSubjectInNewState(state, newSubject)
}

const removeFromKeyArray = (obj, key, value) => {
  if (!obj[key].includes(value)) return
  obj[key] = [...obj[key]].filter((checkValue) => checkValue !== value)
}

export const updateValueErrors = (state, valueKey) => {
  const value = state.values[valueKey]
  const property = state.properties[value.propertyKey]
  const propertyTemplate = state.propertyTemplates[property.propertyTemplateKey]
  // If this is first value, then must have a value.
  const errors = []
  if (value.component === "InputLiteralValue") {
    errors.push(literalRequiredError(value, property, propertyTemplate))
    if (value.literal !== null && value.literal !== "") {
      errors.push(literalRegexValidationError(value, propertyTemplate))
      errors.push(literalIntegerValidationError(value, propertyTemplate))
      errors.push(literalDateTimeValidationError(value, propertyTemplate))
      errors.push(literalDateTimeStampValidationError(value, propertyTemplate))
      errors.push(literalEdtfValidationError(value, propertyTemplate))
    }
  } else if (propertyTemplate.type === "uri") {
    errors.push(uriPropertiesAndValueErrors(value, property, propertyTemplate))
  }

  // all that pushing makes for nested arrays, so flattening
  return mergeValuePropsToNewState(state, valueKey, { errors: errors.flat(1) })
}

const recursiveAncestorsFromSubject = (state, subjectKey, performFunc) => {
  const oldSubject = state.subjects[subjectKey]
  if (!oldSubject) return state

  const newSubject = { ...oldSubject }
  performFunc(newSubject)
  const newState = replaceSubjectInNewState(state, newSubject)

  if (!newSubject.valueSubjectOfKey) return newState
  return recursiveAncestorsFromValue(
    newState,
    newSubject.valueSubjectOfKey,
    performFunc
  )
}

const recursiveAncestorsFromValue = (state, valueKey, performFunc) => {
  const oldValue = state.values[valueKey]
  if (!oldValue) return state

  const newValue = { ...oldValue }

  performFunc(newValue)
  const newState = replaceValueInNewState(state, newValue)

  return recursiveAncestorsFromProperty(
    newState,
    newValue.propertyKey,
    performFunc
  )
}

const recursiveAncestorsFromProperty = (state, propertyKey, performFunc) => {
  const oldProperty = state.properties[propertyKey]
  if (!oldProperty) return state

  const newProperty = { ...oldProperty }
  performFunc(newProperty)
  const newState = replacePropertyInNewState(state, newProperty)

  return recursiveAncestorsFromSubject(
    newState,
    newProperty.subjectKey,
    performFunc
  )
}

const removeFromDescWithErrorPropertyKeysFunc = (propertyKey) => (newObj) => {
  if (
    newObj.descWithErrorPropertyKeys !== undefined &&
    newObj.descWithErrorPropertyKeys.includes(propertyKey)
  ) {
    newObj.descWithErrorPropertyKeys = [
      ...newObj.descWithErrorPropertyKeys,
    ].filter((checkPropertyKey) => propertyKey !== checkPropertyKey)
  }
}

const addToDescWithErrorPropertyKeysFunc = (propertyKey) => (newObj) => {
  if (
    newObj.descWithErrorPropertyKeys !== undefined &&
    !newObj.descWithErrorPropertyKeys.includes(propertyKey)
  ) {
    newObj.descWithErrorPropertyKeys = [
      ...newObj.descWithErrorPropertyKeys,
      propertyKey,
    ]
  }
}

const removeFromDescUriOrLiteralValueKeysFunc = (valueKey) => (newObj) => {
  if (
    newObj.descUriOrLiteralValueKeys !== undefined &&
    newObj.descUriOrLiteralValueKeys.includes(valueKey)
  ) {
    newObj.descUriOrLiteralValueKeys = [
      ...newObj.descUriOrLiteralValueKeys,
    ].filter((checkValueKey) => valueKey !== checkValueKey)
  }
}

const addToDescUriOrLiteralValueKeysFunc = (valueKey) => (newObj) => {
  if (
    newObj.descUriOrLiteralValueKeys !== undefined &&
    !newObj.descUriOrLiteralValueKeys.includes(valueKey)
  ) {
    newObj.descUriOrLiteralValueKeys = [
      ...newObj.descUriOrLiteralValueKeys,
      valueKey,
    ]
  }
}

const addToDescWithErrorPropertyKeys = (state, propertyKey) =>
  recursiveAncestorsFromProperty(
    state,
    propertyKey,
    addToDescWithErrorPropertyKeysFunc(propertyKey)
  )

const removeFromDescWithErrorPropertyKeys = (state, propertyKey) =>
  recursiveAncestorsFromProperty(
    state,
    propertyKey,
    removeFromDescWithErrorPropertyKeysFunc(propertyKey)
  )

export const removeFromDescUriOrLiteralValueKeys = (state, valueKey) =>
  recursiveAncestorsFromValue(
    state,
    valueKey,
    removeFromDescUriOrLiteralValueKeysFunc(valueKey)
  )

export const addToDescUriOrLiteralValueKeys = (state, valueKey) =>
  recursiveAncestorsFromValue(
    state,
    valueKey,
    addToDescUriOrLiteralValueKeysFunc(valueKey)
  )

export const clearSubjectFromNewState = (state, subjectKey) => {
  const subject = state.subjects[subjectKey]
  let newState = {
    ...state,
    subjects: _.omit(state.subjects, [subjectKey]),
  }
  subject.propertyKeys.forEach(
    (propertyKey) =>
      (newState = clearPropertyFromNewState(newState, propertyKey))
  )

  return newState
}

export const clearPropertyFromNewState = (state, propertyKey) => {
  const property = state.properties[propertyKey]

  let newState = {
    ...state,
    properties: _.omit(state.properties, [propertyKey]),
  }

  if (!_.isEmpty(property.valueKeys)) {
    property.valueKeys.forEach(
      (valueKey) => (newState = clearValueFromNewState(newState, valueKey))
    )
  }

  // Remove error from ancestors
  newState = removeFromDescWithErrorPropertyKeys(newState, propertyKey)

  return newState
}

export const clearValueFromNewState = (state, valueKey) => {
  const value = state.values[valueKey]
  let newState = {
    ...state,
    values: _.omit(state.values, [valueKey]),
  }
  if (value.valueSubjectKey)
    newState = clearSubjectFromNewState(newState, value.valueSubjectKey)

  // Remove value key from ancestors' descUriOrLiteralValueKeys
  newState = removeFromDescUriOrLiteralValueKeys(newState, valueKey)

  return newState
}

export const updateDescWithErrorPropertyKeys = (state, propertyKey) => {
  if (propertyHasErrors(state, propertyKey)) {
    // Add key to descWithErrorPropertyKeys for self and ancestors.
    return addToDescWithErrorPropertyKeys(state, propertyKey)
  }
  // Remove key from descWithErrorPropertyKeys for self and ancestors.
  return removeFromDescWithErrorPropertyKeys(state, propertyKey)
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

export const recursiveDescFromSubject = (state, subjectKey, performFunc) => {
  const oldSubject = state.subjects[subjectKey]
  if (!oldSubject) return state

  const newSubject = { ...oldSubject }
  performFunc(newSubject)
  let newState = replaceSubjectInNewState(state, newSubject)

  if (_.isEmpty(newSubject.propertyKeys)) return newState

  newSubject.propertyKeys.forEach((propertyKey) => {
    newState = recursiveDescFromProperty(newState, propertyKey, performFunc)
  })
  return newState
}

const recursiveDescFromValue = (state, valueKey, performFunc) => {
  const oldValue = state.values[valueKey]
  if (!oldValue) return state

  const newValue = { ...oldValue }

  performFunc(newValue)
  let newState = replaceValueInNewState(state, newValue)

  if (newValue.valueSubjectKey) {
    newState = recursiveDescFromSubject(
      newState,
      newValue.valueSubjectKey,
      performFunc
    )
  }

  return newState
}

const recursiveDescFromProperty = (state, propertyKey, performFunc) => {
  const oldProperty = state.properties[propertyKey]
  if (!oldProperty) return state

  const newProperty = { ...oldProperty }
  performFunc(newProperty)
  let newState = replacePropertyInNewState(state, newProperty)

  if (_.isEmpty(newProperty.valueKeys)) return newState
  newProperty.valueKeys.forEach((valueKey) => {
    newState = recursiveDescFromValue(newState, valueKey, performFunc)
  })
  return newState
}
