import _ from 'lodash'
import { resourceEditErrorKey } from 'components/editor/Editor'

export const setBaseURL = (state, action) => {
  const newState = { ...state }

  newState.entities.subjects[action.payload.resourceKey].uri = action.payload.resourceURI

  return newState
}

export const showProperty = (state, action) => {
  const newState = { ...state }

  newState.entities.properties[action.payload].show = true

  return newState
}

export const hideProperty = (state, action) => {
  const newState = { ...state }

  newState.entities.properties[action.payload].show = false

  return newState
}

export const loadResourceFinished = (state, action) => {
  const newState = { ...state }
  newState.entities.subjects[action.payload].changed = false

  return newState
}

export const saveResourceFinished = (state, action) => {
  const newState = { ...state }
  newState.editor.lastSave[action.payload] = Date.now()
  newState.entities.subjects[action.payload].changed = false

  return newState
}

export const setUnusedRDF = (state, action) => {
  const newState = { ...state }
  newState.editor.unusedRDF[action.payload.resourceKey] = action.payload.rdf

  return newState
}

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

export const addSubject = (state, action) => {
  const newState = { ...state }

  addSubjectToNewState(newState, action.payload)

  return newState
}

const addSubjectToNewState = (newState, subject, valueSubjectOfKey) => {
  const newSubject = { ...subject }

  // Add subject to state
  const oldSubject = newState.entities.subjects[newSubject.key]
  newState.entities.subjects[newSubject.key] = newSubject

  newSubject.descUriOrLiteralValueKeys = []
  newSubject.descWithErrorPropertyKeys = []

  // Subject template
  newSubject.subjectTemplateKey = newSubject.subjectTemplate.key
  delete newSubject.subjectTemplate

  // Add valueSubjectOf. If null, this is a root subject.
  newSubject.valueSubjectOfKey = valueSubjectOfKey || null

  // Add rootSubjectKey and rootPropertyKey. If this is not a root subject, then need to find from parent.
  if (valueSubjectOfKey) {
    const parentValueSubject = newState.entities.values[valueSubjectOfKey]
    newSubject.rootSubjectKey = parentValueSubject.rootSubjectKey
    newSubject.rootPropertyKey = parentValueSubject.rootPropertyKey
  } else {
    newSubject.rootSubjectKey = subject.key
    newSubject.rootPropertyKey = null
  }

  // Add properties for resource (if root subject)
  if (newSubject.rootSubjectKey === newSubject.key) {
    if (_.isUndefined(newSubject.group)) newSubject.group = null
    if (_.isUndefined(newSubject.bfAdminMetadataRefs)) newSubject.bfAdminMetadataRefs = []
    if (_.isUndefined(newSubject.bfItemRefs)) newSubject.bfItemRefs = []
    if (_.isUndefined(newSubject.bfInstanceRefs)) newSubject.bfInstanceRefs = []
    if (_.isUndefined(newSubject.bfWorkRefs)) newSubject.bfWorkRefs = []
  }

  // Remove existing properties
  const oldPropertyKeys = oldSubject?.propertyKeys || []
  oldPropertyKeys.forEach((propertyKey) => clearPropertyFromNewState(newState, propertyKey))

  // Add new properties
  newSubject.propertyKeys = []
  newSubject.properties.forEach((property) => addPropertyToNewState(newState, property))
  delete newSubject.properties

  // If changed, then set resource as changed.
  if (!_.isEqual(newSubject, oldSubject)) {
    newState.entities.subjects[newSubject.rootSubjectKey].changed = true
  }
}

export const addProperty = (state, action) => {
  const newState = { ...state }

  addPropertyToNewState(newState, action.payload)

  return newState
}

const addPropertyToNewState = (newState, property) => {
  const newProperty = { ...property }

  // Add property to state
  const oldProperty = newState.entities.properties[newProperty.key]
  newState.entities.properties[newProperty.key] = newProperty

  // Subject
  newProperty.subjectKey = newProperty.subject.key
  delete newProperty.subject

  // Property template
  newProperty.propertyTemplateKey = newProperty.propertyTemplate.key
  delete newProperty.propertyTemplate

  newProperty.descUriOrLiteralValueKeys = []
  newProperty.descWithErrorPropertyKeys = []

  // Add property to subject
  const newSubject = newState.entities.subjects[newProperty.subjectKey]
  // Add if doesn't exist.
  if (newSubject.propertyKeys.indexOf(newProperty.key) === -1) {
    newSubject.propertyKeys = [...newSubject.propertyKeys, newProperty.key]
  }

  // Add root subject and property from subject
  newProperty.rootSubjectKey = newSubject.rootSubjectKey
  // If subject does not have a root property, then this is a root property.
  newProperty.rootPropertyKey = newSubject.rootPropertyKey || newProperty.key

  // Remove existing values
  const oldValueKeys = oldProperty?.valueKeys || []
  oldValueKeys.forEach((valueKey) => {
    removeBibframeRefs(newState, newState.entities.values[valueKey], oldProperty)
    clearValueFromNewState(newState, valueKey)
  })

  // Add new values
  if (newProperty.values) {
    newProperty.valueKeys = []
    newProperty.values.forEach((value) => addValueToNewState(newState, value))
  } else {
    newProperty.valueKeys = null
  }
  delete newProperty.values

  // Errors
  updateErrors(newState, newProperty)

  // If changed, then set resource as changed.
  if (!_.isEqual(newProperty, oldProperty)) {
    newState.entities.subjects[newProperty.rootSubjectKey].changed = true
  }
}

export const addValue = (state, action) => {
  const newState = { ...state }

  addValueToNewState(newState, action.payload.value, action.payload.siblingValueKey)

  return newState
}

const addValueToNewState = (newState, value, siblingValueKey) => {
  const newValue = { ...value }
  // Property
  newValue.propertyKey = newValue.property.key
  delete newValue.property

  // Remove index
  delete newValue.index

  // Add value to state
  const oldValue = newState.entities.values[newValue.key]
  newState.entities.values[newValue.key] = newValue

  // Add value to property
  const newProperty = newState.entities.properties[newValue.propertyKey]
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
  newProperty.show = true

  // Add root subject and property from property
  newValue.rootSubjectKey = newProperty.rootSubjectKey
  newValue.rootPropertyKey = newProperty.rootPropertyKey

  // Remove existing value subject
  if (oldValue?.valueSubjectKey) {
    clearSubjectFromNewState(newState, oldValue.valueSubjectKey)
  }

  // Add new value subject
  if (newValue.valueSubject) {
    addSubjectToNewState(newState, newValue.valueSubject, newValue.key)
    newValue.valueSubjectKey = newValue.valueSubject.key
  } else {
    newValue.valueSubjectKey = null
    // Add value key to ancestors (for URIs and literals)
    addValueKeyToAncestors(newState, newValue)
  }
  delete newValue.valueSubject

  // Errors
  updateErrors(newState, newProperty)

  // Update Bibframe refs
  updateBibframeRefs(newState, newValue, newProperty)

  // If changed, then set resource as changed.
  if (!_.isEqual(newValue, oldValue)) {
    newState.entities.subjects[newValue.rootSubjectKey].changed = true
  }
}

const updateBibframeRefs = (newState, newValue, newProperty) => {
  if (!newValue.uri) return
  const newPropertyTemplate = newState.entities.propertyTemplates[newProperty.propertyTemplateKey]
  const newSubject = newState.entities.subjects[newValue.rootSubjectKey]
  switch (newPropertyTemplate.uri) {
    case 'http://id.loc.gov/ontologies/bibframe/adminMetadata':
      // References admin metadata
      pushUniq(newSubject.bfAdminMetadataRefs, newValue.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/itemOf':
      // References instance
      pushUniq(newSubject.bfInstanceRefs, newValue.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/hasItem':
      // References item
      pushUniq(newSubject.bfItemRefs, newValue.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/instanceOf':
      // References work
      pushUniq(newSubject.bfWorkRefs, newValue.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/hasInstance':
      // References instance
      pushUniq(newSubject.bfInstanceRefs, newValue.uri)
      break
    default:
      // Nothing
  }
}

const pushUniq = (array, value) => {
  if (array.indexOf(value) === -1) array.push(value)
}

export const removeValue = (state, action) => {
  const newState = { ...state }

  const value = newState.entities.values[action.payload]

  // Remove from property
  const newProperty = { ...newState.entities.properties[value.propertyKey] }
  newState.entities.properties[value.propertyKey] = newProperty
  newProperty.valueKeys = newProperty.valueKeys.filter((valueKey) => valueKey !== action.payload)

  // Recursively remove value
  clearValueFromNewState(newState, value.key)

  // Errors
  updateErrors(newState, newProperty)

  removeValueKeyFromAncestors(newState, value)

  // Set resource as changed
  newState.entities.subjects[value.rootSubjectKey].changed = true

  removeBibframeRefs(newState, value, newProperty)

  return newState
}

const removeBibframeRefs = (newState, value, newProperty) => {
  if (!value.uri) return
  const newPropertyTemplate = newState.entities.propertyTemplates[newProperty.propertyTemplateKey]
  const newSubject = newState.entities.subjects[value.rootSubjectKey]
  switch (newPropertyTemplate.uri) {
    case 'http://id.loc.gov/ontologies/bibframe/adminMetadata':
      // References admin metadata
      newSubject.bfAdminMetadataRefs = newSubject.bfAdminMetadataRefs.filter((uri) => uri !== value.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/itemOf':
      // References instance
      newSubject.bfInstanceRefs = newSubject.bfInstanceRefs.filter((uri) => uri !== value.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/hasItem':
      // References item
      newSubject.bfItemRefs = newSubject.bfItemRefs.filter((uri) => uri !== value.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/instanceOf':
      // References work
      newSubject.bfWorkRefs = newSubject.bfWorkRefs.filter((uri) => uri !== value.uri)
      break
    case 'http://id.loc.gov/ontologies/bibframe/hasInstance':
      // References instance
      newSubject.bfInstanceRefs = newSubject.bfInstanceRefs.filter((uri) => uri !== value.uri)
      break
    default:
      // Nothing
  }
}

export const removeSubject = (state, action) => {
  const newState = { ...state }

  const subject = newState.entities.subjects[action.payload]

  // Recursively remove subject
  clearSubjectFromNewState(newState, subject.key)

  if (subject.rootSubjectKey !== action.payload) newState.entities.subjects[subject.rootSubjectKey].changed = true

  return newState
}

const errorsForProperty = (property, propertyTemplate) => {
  if (propertyTemplate.type !== 'resource' && propertyTemplate.required && _.isEmpty(property.valueKeys)) {
    return ['Required']
  }
  return []
}

const updateErrors = (newState, newProperty) => {
  newProperty.errors = errorsForProperty(newProperty, newState.entities.propertyTemplates[newProperty.propertyTemplateKey])
  const ancestors = ancestorsFromProperty(newState, newProperty)
  if (_.isEmpty(newProperty.errors)) {
    // Remove key from descWithErrorPropertyKeys for self and ancestors.
    ancestors.forEach((ancestor) => {
      if (ancestor.descWithErrorPropertyKeys !== undefined && ancestor.descWithErrorPropertyKeys.indexOf(newProperty.key) !== -1) {
        ancestor.descWithErrorPropertyKeys = ancestor.descWithErrorPropertyKeys.filter((propertyKey) => propertyKey !== newProperty.key)
      }
    })
  } else {
    // Add key to descWithErrorPropertyKeys for self and ancestors.
    ancestors.forEach((ancestor) => {
      if (ancestor.descWithErrorPropertyKeys !== undefined && ancestor.descWithErrorPropertyKeys.indexOf(newProperty.key) === -1) {
        ancestor.descWithErrorPropertyKeys = [...ancestor.descWithErrorPropertyKeys, newProperty.key]
      }
    })
  }
}

export const clearResourceFromEditor = (state, action) => {
  const resourceKey = action.payload
  const newState = {
    ...state,
    errors: {
      ...state.errors,
    },
  }

  const resourceIndex = state.resources.indexOf(resourceKey)
  newState.resources = [...state.resources.slice(0, resourceIndex), ...state.resources.slice(resourceIndex + 1)]

  if (state.currentResource === resourceKey) {
    newState.currentResource = _.first(newState.resources)
  }

  delete newState.errors[resourceEditErrorKey(resourceKey)]

  return newState
}

export const clearResource = (state, action) => {
  const newState = { ...state }
  const resourceKey = action.payload

  delete newState.editor.lastSave[resourceKey]
  delete newState.editor.unusedRDF[resourceKey]

  clearSubjectFromNewState(newState, resourceKey)

  return newState
}

const clearSubjectFromNewState = (newState, subjectKey) => {
  const subject = newState.entities.subjects[subjectKey]
  subject.propertyKeys.forEach((propertyKey) => clearPropertyFromNewState(newState, propertyKey))
  delete newState.entities.subjects[subjectKey]
}

const clearPropertyFromNewState = (newState, propertyKey) => {
  const property = newState.entities.properties[propertyKey]
  if (!_.isEmpty(property.valueKeys)) {
    property.valueKeys.forEach((valueKey) => clearValueFromNewState(newState, valueKey))
  }
  removeErrorFromAncestors(newState, property)

  delete newState.entities.properties[propertyKey]
}

const clearValueFromNewState = (newState, valueKey) => {
  const value = newState.entities.values[valueKey]
  if (value.valueSubjectKey) clearSubjectFromNewState(newState, value.valueSubjectKey)

  removeValueKeyFromAncestors(newState, value)

  delete newState.entities.values[valueKey]
}

export const setResourceGroup = (state, action) => {
  const newState = { ...state }

  newState.entities.subjects[action.payload.resourceKey].group = action.payload.group

  return newState
}

export const setValueOrder = (state, action) => {
  const newState = { ...state }

  const valueKey = action.payload.valueKey
  const index = action.payload.index
  const newValue = newState.entities.values[valueKey]
  const newProperty = newState.entities.properties[newValue.propertyKey]

  const filterValueKeys = newProperty.valueKeys.filter((key) => key !== valueKey)
  newProperty.valueKeys = [...filterValueKeys.slice(0, index - 1), valueKey, ...filterValueKeys.slice(index - 1)]

  return newState
}

const ancestorsFromProperty = (state, property) => {
  const ancestors = [property]
  recursiveAncestorsFromProperty(state, property, ancestors)
  return ancestors
}

const ancestorsFromValue = (state, value) => {
  const ancestors = [value]
  recursiveAncestorsFromValue(state, value, ancestors)
  return ancestors
}

const recursiveAncestorsFromSubject = (state, subject, ancestors) => {
  if (!subject.valueSubjectOfKey) return
  const parent = state.entities.values[subject.valueSubjectOfKey]
  ancestors.push(parent)
  recursiveAncestorsFromValue(state, parent, ancestors)
}

const recursiveAncestorsFromValue = (state, value, ancestors) => {
  const parent = state.entities.properties[value.propertyKey]
  ancestors.push(parent)
  recursiveAncestorsFromProperty(state, parent, ancestors)
}

const recursiveAncestorsFromProperty = (state, property, ancestors) => {
  const parent = state.entities.subjects[property.subjectKey]
  ancestors.push(parent)
  recursiveAncestorsFromSubject(state, parent, ancestors)
}

const addValueKeyToAncestors = (newState, value) => {
  const ancestors = ancestorsFromValue(newState, value)

  // Add key to descWithErrorPropertyKeys for self and ancestors.
  ancestors.forEach((ancestor) => {
    if (ancestor.descUriOrLiteralValueKeys !== undefined && ancestor.descUriOrLiteralValueKeys.indexOf(value.key) === -1) {
      ancestor.descUriOrLiteralValueKeys = [...ancestor.descUriOrLiteralValueKeys, value.key]
    }
  })
}

const removeValueKeyFromAncestors = (newState, value) => {
  const ancestors = ancestorsFromValue(newState, value)

  // Add key to descWithErrorPropertyKeys for self and ancestors.
  ancestors.forEach((ancestor) => {
    if (ancestor.descUriOrLiteralValueKeys !== undefined && ancestor.descUriOrLiteralValueKeys.indexOf(value.key) !== -1) {
      ancestor.descUriOrLiteralValueKeys = ancestor.descUriOrLiteralValueKeys.filter((valueKey) => valueKey !== value.key)
    }
  })
}

const removeErrorFromAncestors = (newState, property) => {
  const ancestors = ancestorsFromProperty(newState, property)
  // Remove key from descWithErrorPropertyKeys for self and ancestors.
  ancestors.forEach((ancestor) => {
    if (ancestor.descWithErrorPropertyKeys !== undefined && ancestor.descWithErrorPropertyKeys.indexOf(property.key) !== -1) {
      ancestor.descWithErrorPropertyKeys = ancestor.descWithErrorPropertyKeys.filter((propertyKey) => propertyKey !== property.key)
    }
  })
}
