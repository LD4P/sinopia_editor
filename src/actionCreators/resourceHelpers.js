import rdf from 'rdf-ext'
import shortid from 'shortid'
import _ from 'lodash'
import { loadResourceTemplate } from 'actionCreators/templates'
import {
  addSubject as addSubjectAction,
  addProperty as addPropertyAction,
  addValue as addValueAction,
  removeSubject as removeSubjectAction,
  removeProperty as removePropertyAction,
} from 'actions/resources'
import {
  selectProperty, selectNormProperty, selectNormSubject, selectNormValue, selectSubject,
} from 'selectors/resources'
import { newLiteralValue, newUriValue, newValueSubject } from 'utilities/valueFactory'
import { removeValue } from './resources'

// These should only be used in 'actionCreators/resources'

export const addResourceFromDataset = (dataset, uri, resourceTemplateId, errorKey, asNewResource) => (dispatch) => {
  const subjectTerm = rdf.namedNode(chooseURI(dataset, uri))
  const newUri = asNewResource ? null : uri
  const usedDataset = rdf.dataset()
  usedDataset.addAll(dataset.match(subjectTerm, rdf.namedNode('http://sinopia.io/vocabulary/hasResourceTemplate')))
  usedDataset.addAll(dataset.match(subjectTerm, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')))
  return Promise.all([dispatch(recursiveResourceFromDataset(subjectTerm, newUri, resourceTemplateId, dataset, usedDataset)), Promise.resolve(usedDataset)])
}

// In the early days, resources were persisted to Trellis with a relative URI (<>) as N-Triples.
// When these resources are retrieved, they retain a relative URI.
// Now, resources are persisted to Trellis as Turtle. When these resources are retrieved,
// they have the resource's URI.
// This function guesses which.
const chooseURI = (dataset, uri) => (dataset.match(rdf.namedNode(uri)).size > 0 ? uri : '')

export const addEmptyResource = (resourceTemplateId, errorKey) => (dispatch) => dispatch(addSubject(null, resourceTemplateId, errorKey))
  .then(([subject, , propertyTemplates]) => {
    const properties = dispatch(addPropertiesFromTemplates(subject.key, propertyTemplates, false))
    subject.properties = properties
    return subject
  })

const recursiveResourceFromDataset = (subjectTerm, uri, resourceTemplateId, dataset,
  usedDataset, errorKey) => (dispatch) => dispatch(addSubject(uri, resourceTemplateId, errorKey))
  .then(([subject, , propertyTemplates]) => {
    const properties = dispatch(addPropertiesFromTemplates(subject.key, propertyTemplates, true))
    return Promise.all(
      properties.map((property) => dispatch(addValuesFromDataset(subjectTerm, property.key, property.propertyTemplate, dataset, usedDataset, errorKey))
        .then((values) => {
          const compactValues = _.compact(values)
          property.values = compactValues
          property.valueKeys = compactValues.map((value) => value.key)
          compactValues.forEach((value) => value.property = property)
          return compactValues
        })),
    )
      .then(() => {
        subject.properties = properties
        subject.propertyKeys = properties.map((property) => property.key)
        return subject
      })
  })

export const addSubject = (uri, resourceTemplateId, errorKey) => (dispatch) => {
  const key = shortid.generate()
  return dispatch(loadResourceTemplate(resourceTemplateId, errorKey))
    .then(([subjectTemplate, propertyTemplates]) => {
      // This handles if there was an error fetching resource template
      if (!subjectTemplate) {
        const err = new Error(`Unable to load ${resourceTemplateId}`)
        err.name = 'ResourceTemplateError'
        console.error(err.toString())
        throw err
      }

      const subject = {
        key,
        uri: _.isEmpty(uri) ? null : uri,
        subjectTemplateKey: subjectTemplate.key,
        subjectTemplate,
        propertyKeys: [],
      }
      // Add the subject
      dispatch(addSubjectAction(subject))
      return [subject, subjectTemplate, propertyTemplates]
    })
}

export const addPropertiesFromTemplates = (subjectKey, propertyTemplates, noDefaults) => (dispatch) => propertyTemplates.map((propertyTemplate) => {
  const property = dispatch(addProperty(subjectKey, propertyTemplate, noDefaults))
  return property
})

const addValuesFromDataset = (subjectTerm, propertyKey, propertyTemplate, dataset, usedDataset, errorKey) => (dispatch) => {
  // All quads for this property
  const quads = dataset.match(subjectTerm, rdf.namedNode(propertyTemplate.uri)).toArray()
  return Promise.all(quads.map((quad) => {
    if (propertyTemplate.type === 'resource') {
      return dispatch(addNestedResourceFromQuad(quad, propertyKey, propertyTemplate, dataset, usedDataset, errorKey))
    } if (quad.object.termType === 'NamedNode') {
      // URI
      return Promise.resolve(dispatch(addUriFromQuad(quad, propertyKey, dataset, usedDataset)))
    }
    // Literal
    return Promise.resolve(dispatch(addLiteralFromQuad(quad, propertyKey, usedDataset)))
  }))
}

const addNestedResourceFromQuad = (quad, propertyKey, propertyTemplate, dataset, usedDataset, errorKey) => (dispatch) => {
  // Only build this embedded resource if can find the resource template.
  // Multiple types may be provided.
  const typeQuads = dataset.match(quad.object, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).toArray()

  // Among the valueTemplateRefs, find all of the resource templates that match a type.
  // Ideally, only want 1 but need to handle other cases.
  return Promise.all(typeQuads.map(async (typeQuad) => dispatch(selectResourceTemplateId(propertyTemplate, typeQuad.object.value))))
    .then((childRtIds) => {
      const compactChildRtIds = _.compact(_.flatten(childRtIds))

      // Don't know which to pick, so error.
      if (compactChildRtIds.length > 1) {
        throw `More than one resource template matches: ${compactChildRtIds}`
      }
      // No matching resource template, so do nothing
      if (_.isEmpty(compactChildRtIds)) {
        return null
      }
      usedDataset.add(quad)
      usedDataset.addAll(typeQuads)

      // One resource template
      return dispatch(recursiveResourceFromDataset(quad.object, null, compactChildRtIds[0], dataset, usedDataset, errorKey))
        .then((subject) => {
          const value = dispatch(addValueSubject(propertyKey, subject.key))
          value.valueSubject = subject
          return value
        })
    })
}

const selectResourceTemplateId = (propertyTemplate, resourceURI, errorKey) => (dispatch) => Promise.all(
  // The keys are resource template ids. They may or may not be in state
  propertyTemplate.valueSubjectTemplateKeys.map(async (resourceTemplateId) => dispatch(loadResourceTemplate(resourceTemplateId, errorKey))
    .then(([subjectTemplate]) => (subjectTemplate.class === resourceURI ? resourceTemplateId : undefined))),
)

const addLiteralFromQuad = (quad, propertyKey, usedDataset) => (dispatch) => {
  usedDataset.add(quad)
  return dispatch(addLiteralValue(propertyKey, quad.object.value, quad.object.language))
}

const addUriFromQuad = (quad, propertyKey, dataset, usedDataset) => (dispatch) => {
  const uri = quad.object.value
  usedDataset.add(quad)
  const labelQuads = dataset.match(quad.object, rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')).toArray()
  let label = uri
  if (labelQuads.length > 0) {
    label = labelQuads[0].object.value // Use first match
    usedDataset.add(labelQuads[0])
  }

  return dispatch(addUriValue(propertyKey, uri, label))
}

const addLiteralValue = (propertyKey, literal, lang) => (dispatch) => {
  const value = newLiteralValue(propertyKey, literal, lang)
  dispatch(addValueAction(value))
  return value
}

const addUriValue = (propertyKey, uri, label) => (dispatch) => {
  const value = newUriValue(propertyKey, uri, label)
  dispatch(addValueAction(value))
  return value
}

export const addValueSubject = (propertyKey, subjectKey, siblingValueKey) => (dispatch) => {
  const value = newValueSubject(propertyKey, subjectKey)
  dispatch(addValueAction(value, siblingValueKey))
  return value
}

const addProperty = (subjectKey, propertyTemplate, noDefaults) => (dispatch) => {
  const key = shortid.generate()
  const property = {
    key,
    subjectKey,
    propertyTemplateKey: propertyTemplate.key,
    propertyTemplate,
    valueKeys: null,
    show: false,
  }
  dispatch(addPropertyAction(property))
  if (!noDefaults && !_.isEmpty(property.propertyTemplate.defaults)) {
    const values = property.propertyTemplate.defaults.map((defaultValue) => {
      if (property.propertyTemplate.type === 'uri') {
        return dispatch(addUriValue(key, defaultValue.uri, defaultValue.label))
      }
      return dispatch(addLiteralValue(key, defaultValue.literal, defaultValue.lang))
    })
    property.values = values
    property.valueKeys = values.map((value) => value.key)
    values.forEach((value) => value.property = property)
  }
  return property
}

const removeProperty = (propertyKey) => (dispatch, getState) => {
  const property = selectNormProperty(getState(), propertyKey)
  // Remove each of the values.
  if (property.valueKeys !== null) {
    property.valueKeys.forEach((valueKey) => dispatch(removeValue(valueKey)))
  }
  // Remove the property
  dispatch(removePropertyAction(propertyKey))
}

export const removeSubject = (subjectKey) => (dispatch, getState) => {
  const subject = selectNormSubject(getState(), subjectKey)
  // Remove properties.
  subject.propertyKeys.forEach((propertyKey) => dispatch(removeProperty(propertyKey)))
  // Remove subject
  dispatch(removeSubjectAction(subjectKey))
}

export const addSubjectCopy = (subjectKey) => (dispatch, getState) => {
  const subject = selectSubject(getState(), subjectKey)
  const newSubject = { ...subject }

  const key = shortid.generate()
  newSubject.key = key
  newSubject.uri = null
  newSubject.propertyKeys = []
  newSubject.properties = []
  dispatch(addSubjectAction(newSubject))

  const newProperties = subject.propertyKeys.map((propertyKey) => dispatch(addPropertyCopy(propertyKey, newSubject)))
  newSubject.properties = newProperties
  newSubject.propertyKeys = newProperties.map((property) => property.key)

  return newSubject
}

const addPropertyCopy = (propertyKey, subject) => (dispatch, getState) => {
  const property = selectProperty(getState(), propertyKey)
  const newProperty = { ...property }

  const key = shortid.generate()
  newProperty.key = key
  newProperty.subjectKey = subject.key
  newProperty.subject = subject
  newProperty.valueKeys = property.valueKeys === null ? null : []
  newProperty.values = property.valueKeys === null ? null : []
  dispatch(addPropertyAction(newProperty))

  if (property.valueKeys) {
    const newValues = property.valueKeys.map((valueKey) => dispatch(addValueCopy(valueKey, newProperty)))
    newProperty.values = newValues
    newProperty.valueKeys = newValues.map((value) => value.key)
  }

  return newProperty
}

const addValueCopy = (valueKey, property) => (dispatch, getState) => {
  const value = selectNormValue(getState(), valueKey)
  const newValue = { ...value }

  const key = shortid.generate()
  newValue.key = key
  newValue.propertyKey = property.key
  newValue.property = property
  if (value.valueSubjectKey) {
    const newValueSubject = dispatch(addSubjectCopy(value.valueSubjectKey))
    newValue.valueSubject = newValueSubject
    newValue.valueSubjectKey = newValueSubject.key
  }

  dispatch(addValueAction(newValue))

  return newValue
}
