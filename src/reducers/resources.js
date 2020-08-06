import { selectPropertyTemplate } from 'selectors/templates'
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
  const newState = { ...state }

  const resourceKey = action.payload
  newState.editor.currentResource = resourceKey
  if (newState.editor.resources.indexOf(resourceKey) === -1) {
    newState.editor.resources = [...newState.editor.resources, resourceKey]
  }
  return newState
}

export const addSubject = (state, action) => {
  const newState = { ...state }

  addSubjectToNewState(newState, action.payload)

  return newState
}

const addSubjectToNewState = (newState, subject) => {
  const newSubject = { ...subject }
  // Subject template
  newSubject.subjectTemplateKey = newSubject.subjectTemplate.key
  delete newSubject.subjectTemplate

  // Add properties for resource (root subject)
  if (newSubject.resourceKey === newSubject.key) {
    if (_.isUndefined(newSubject.group)) newSubject.group = null
    if (_.isUndefined(newSubject.bfAdminMetadataRefs)) newSubject.bfAdminMetadataRefs = []
    if (_.isUndefined(newSubject.bfItemRefs)) newSubject.bfItemRefs = []
    if (_.isUndefined(newSubject.bfInstanceRefs)) newSubject.bfInstanceRefs = []
    if (_.isUndefined(newSubject.bfWorkRefs)) newSubject.bfWorkRefs = []
  }

  // Add subject to state
  const oldSubject = newState.entities.subjects[newSubject.key]
  newState.entities.subjects[newSubject.key] = newSubject

  // Remove existing properties
  const oldPropertyKeys = oldSubject?.propertyKeys || []
  oldPropertyKeys.forEach((propertyKey) => clearPropertyFromNewState(newState, propertyKey))

  // Add new properties
  newSubject.propertyKeys = []
  newSubject.properties.forEach((property) => addPropertyToNewState(newState, property))
  delete newSubject.properties

  // If changed, then set resource as changed.
  if (!_.isEqual(newSubject, oldSubject)) {
    newState.entities.subjects[newSubject.resourceKey].changed = true
  }
}

export const addProperty = (state, action) => {
  const newState = { ...state }

  addPropertyToNewState(newState, action.payload)

  return newState
}

const addPropertyToNewState = (newState, property) => {
  const newProperty = { ...property }

  // Subject
  newProperty.subjectKey = newProperty.subject.key
  delete newProperty.subject

  // Property template
  newProperty.propertyTemplateKey = newProperty.propertyTemplate.key
  delete newProperty.propertyTemplate

  // Errors
  newProperty.errors = errorsForProperty(newProperty, property.propertyTemplate)

  // Add property to state
  const oldProperty = newState.entities.properties[newProperty.key]
  newState.entities.properties[newProperty.key] = newProperty

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

  // Add property to subject
  const newSubject = newState.entities.subjects[newProperty.subjectKey]
  // Add if doesn't exist.
  if (newSubject.propertyKeys.indexOf(newProperty.key) === -1) {
    newSubject.propertyKeys = [...newSubject.propertyKeys, newProperty.key]
  }

  // If changed, then set resource as changed.
  if (!_.isEqual(newProperty, oldProperty)) {
    newState.entities.subjects[newProperty.resourceKey].changed = true
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

  // Remove existing value subject
  if (oldValue?.valueSubjectKey) {
    clearSubjectFromNewState(newState, oldValue.valueSubjectKey)
  }

  // Add new value subject
  if (newValue.valueSubject) {
    addSubjectToNewState(newState, newValue.valueSubject)
    newValue.valueSubjectKey = newValue.valueSubject.key
  } else {
    newValue.valueSubjectKey = null
  }
  delete newValue.valueSubject

  // Errors
  const propertyTemplate = selectPropertyTemplate({ selectorReducer: newState }, newProperty.propertyTemplateKey)
  newProperty.errors = errorsForProperty(newProperty, propertyTemplate)

  // Update Bibframe refs
  updateBibframeRefs(newState, newValue, newProperty)

  // If changed, then set resource as changed.
  if (!_.isEqual(newValue, oldValue)) {
    newState.entities.subjects[newValue.resourceKey].changed = true
  }
}

const updateBibframeRefs = (newState, newValue, newProperty) => {
  if (!newValue.uri) return
  const newPropertyTemplate = newState.entities.propertyTemplates[newProperty.propertyTemplateKey]
  const newSubject = newState.entities.subjects[newValue.resourceKey]
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
  const property = newState.entities.properties[value.propertyKey]
  property.valueKeys = property.valueKeys.filter((valueKey) => valueKey !== action.payload)

  // Recursively remove value
  clearValueFromNewState(newState, value.key)

  // Errors
  const propertyTemplate = selectPropertyTemplate({ selectorReducer: newState }, property.propertyTemplateKey)
  property.errors = errorsForProperty(property, propertyTemplate)

  // Set resource as changed
  newState.entities.subjects[value.resourceKey].changed = true

  removeBibframeRefs(newState, value, property)

  return newState
}

const removeBibframeRefs = (newState, value, newProperty) => {
  if (!value.uri) return
  const newPropertyTemplate = newState.entities.propertyTemplates[newProperty.propertyTemplateKey]
  const newSubject = newState.entities.subjects[value.resourceKey]
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

export const removeProperty = (state, action) => {
  const newState = { ...state }

  const property = newState.entities.properties[action.payload]

  // Remove from subject
  const subject = newState.entities.subjects[property.subjectKey]
  newState.entities.subjects[property.subjectKey].propertyKeys = subject.propertyKeys.filter((propertyKey) => propertyKey !== action.payload)

  // Recursively remove property
  clearPropertyFromNewState(newState, property.key)

  newState.entities.subjects[property.resourceKey].changed = true

  return newState
}

export const removeSubject = (state, action) => {
  const newState = { ...state }

  const subject = newState.entities.subjects[action.payload]

  // Recursively remove subject
  clearSubjectFromNewState(newState, subject.key)

  if (subject.resourceKey !== action.payload) newState.entities.subjects[subject.resourceKey].changed = true

  return newState
}

const errorsForProperty = (property, propertyTemplate) => {
  if (propertyTemplate.type !== 'resource' && propertyTemplate.required && _.isEmpty(property.valueKeys)) {
    return ['Required']
  }
  return []
}

export const clearResource = (state, action) => {
  const newState = { ...state }
  const resourceKey = action.payload
  newState.editor.resources = newState.editor.resources.filter((checkResourceKey) => checkResourceKey !== resourceKey)
  if (newState.editor.currentResource === resourceKey) {
    newState.editor.currentResource = _.first(newState.editor.resources)
  }

  delete newState.editor.lastSave[resourceKey]
  delete newState.editor.unusedRDF[resourceKey]
  delete newState.editor.errors[resourceEditErrorKey(resourceKey)]
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
  delete newState.entities.properties[propertyKey]
}

const clearValueFromNewState = (newState, valueKey) => {
  const value = newState.entities.values[valueKey]
  if (value.valueSubjectKey) clearSubjectFromNewState(newState, value.valueSubjectKey)
  delete newState.entities.values[valueKey]
}

export const setResourceGroup = (state, action) => {
  const newState = { ...state }

  newState.entities.subjects[action.payload.resourceKey].group = action.payload.group

  return newState
}
