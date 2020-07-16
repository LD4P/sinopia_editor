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

  const subject = state.entities.subjects[action.payload.key]
  const newSubject = { ...action.payload }
  delete newSubject.properties
  delete newSubject.subjectTemplate
  newState.entities.subjects[action.payload.key] = newSubject

  if (!_.isEqual(newSubject, subject)) {
    newState.entities.subjects[newSubject.resourceKey].changed = true
  }

  return newState
}

export const addProperty = (state, action) => {
  const newState = { ...state }

  const property = state.entities.properties[action.payload.key]
  const newProperty = { ...action.payload }
  delete newProperty.subject
  delete newProperty.values
  delete newProperty.propertyTemplate
  newProperty.errors = errorsForProperty(state, newProperty)
  newState.entities.properties[action.payload.key] = newProperty

  const subject = newState.entities.subjects[action.payload.subjectKey]
  // Add if doesn't exist.
  if (subject.propertyKeys.indexOf(action.payload.key) === -1) {
    subject.propertyKeys = [...subject.propertyKeys, action.payload.key]
  }

  if (!_.isEqual(newProperty, property)) {
    newState.entities.subjects[newProperty.resourceKey].changed = true
  }


  return newState
}

export const addValue = (state, action) => {
  const newState = { ...state }

  const origValue = action.payload.value
  const newValue = { ...origValue }
  cleanValue(newValue)
  newState.entities.values[origValue.key] = newValue

  const property = newState.entities.properties[origValue.propertyKey]
  const valueKeys = property.valueKeys || []
  // Add if doesn't exist.
  if (valueKeys.indexOf(origValue.key) === -1) {
    if (action.payload.siblingValueKey) {
      const index = property.valueKeys.indexOf(action.payload.siblingValueKey)
      property.valueKeys.splice(index + 1, 0, origValue.key)
    } else {
      property.valueKeys = [...valueKeys, origValue.key]
    }
  }
  property.show = true
  property.errors = errorsForProperty(state, property)

  if (!_.isEqual(newValue, state.entities.values[action.payload.key])) {
    newState.entities.subjects[newValue.resourceKey].changed = true
  }

  return newState
}

export const removeValue = (state, action) => {
  const newState = { ...state }

  const value = newState.entities.values[action.payload]
  delete newState.entities.values[action.payload]

  const property = newState.entities.properties[value.propertyKey]
  property.valueKeys = property.valueKeys.filter((valueKey) => valueKey !== action.payload)
  property.errors = errorsForProperty(newState, property)

  newState.entities.subjects[value.resourceKey].changed = true

  return newState
}

export const removeProperty = (state, action) => {
  const newState = { ...state }

  const property = newState.entities.properties[action.payload]
  const subject = newState.entities.subjects[property.subjectKey]
  newState.entities.subjects[property.subjectKey].propertyKeys = subject.propertyKeys.filter((propertyKey) => propertyKey !== action.payload)
  clearProperty(newState, property.key)

  newState.entities.subjects[property.resourceKey].changed = true

  return newState
}

export const removeSubject = (state, action) => {
  const newState = { ...state }

  const subject = newState.entities.subjects[action.payload]
  delete newState.entities.subjects[action.payload]

  if (subject.resourceKey !== action.payload) newState.entities.subjects[subject.resourceKey].changed = true

  return newState
}

const errorsForProperty = (state, property) => {
  const propertyTemplate = selectPropertyTemplate({ selectorReducer: state }, property.propertyTemplateKey)
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
  clearSubject(newState, resourceKey)

  return newState
}

const clearSubject = (newState, subjectKey) => {
  const subject = newState.entities.subjects[subjectKey]
  subject.propertyKeys.forEach((propertyKey) => clearProperty(newState, propertyKey))
  delete newState.entities.subjects[subjectKey]
}

const clearProperty = (newState, propertyKey) => {
  const property = newState.entities.properties[propertyKey]
  if (!_.isEmpty(property.valueKey)) {
    property.valueKeys.forEach((valueKey) => clearValue(newState, valueKey))
  }
  delete newState.entities.properties[propertyKey]
}

const clearValue = (newState, valueKey) => {
  const value = newState.entities.values[valueKey]
  if (value.valueSubjectKey) clearSubject(newState, value.valueSubjectKey)
  delete newState.entities.values[valueKey]
}

export const replaceValues = (state, action) => {
  if (_.isEmpty(action.payload)) return state

  const newState = { ...state }
  const newValues = [...action.payload]

  const existingValueKeys = [...newState.entities.properties[newValues[0].propertyKey].valueKeys]

  newValues.forEach((newValue) => {
    cleanValue(newValue)
    newState.entities.values[newValue.key] = newValue
  })

  const property = newState.entities.properties[newValues[0].propertyKey]
  property.valueKeys = newValues.map((newValue) => newValue.key)
  property.errors = errorsForProperty(state, property)

  // Remove existing values
  if (!_.isEmpty(existingValueKeys)) {
    existingValueKeys.forEach((valueKey) => {
      clearValue(newState, valueKey)
    })
  }

  newState.entities.subjects[newValues[0].resourceKey].changed = true

  return newState
}

export const clearValues = (state, action) => {
  const newState = { ...state }

  const property = newState.entities.properties[action.payload]
  newState.entities.properties[action.payload].valueKeys = []

  newState.entities.subjects[property.resourceKey].changed = true

  return newState
}

const cleanValue = (newValue) => {
  delete newValue.property
  delete newValue.valueSubject
  return newValue
}
