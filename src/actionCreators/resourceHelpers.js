import rdf from 'rdf-ext'
import shortid from 'shortid'
import _ from 'lodash'
import { loadResourceTemplate } from 'actionCreators/templates'
import { addSubject as addSubjectAction } from 'actions/resources'
import {
  selectProperty, selectSubject, selectValue,
} from 'selectors/resources'
import { newLiteralValue, newUriValue, newValueSubject } from 'utilities/valueFactory'
import { datasetFromJsonld } from 'utilities/Utilities'

/**
 * Helper methods that should only be used in 'actionCreators/resources'
 */

export const addResourceFromDataset = (dataset, uri, resourceTemplateId, errorKey, asNewResource, group) => (dispatch) => {
  const subjectTerm = rdf.namedNode(chooseURI(dataset, uri))
  const newUri = asNewResource ? null : uri
  const usedDataset = rdf.dataset()
  usedDataset.addAll(dataset.match(subjectTerm, rdf.namedNode('http://sinopia.io/vocabulary/hasResourceTemplate')))
  usedDataset.addAll(dataset.match(subjectTerm, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')))
  return dispatch(recursiveResourceFromDataset(subjectTerm, newUri, resourceTemplateId, null, dataset, usedDataset, errorKey))
    .then((resource) => {
      resource.group = group
      dispatch(addSubjectAction(resource))
      return [resource, usedDataset]
    })
}

// In the early days, resources were persisted to Trellis with a relative URI (<>) as N-Triples.
// When these resources are retrieved, they retain a relative URI.
// Now, resources are persisted to Trellis as Turtle. When these resources are retrieved,
// they have the resource's URI.
// This function guesses which.
export const chooseURI = (dataset, uri) => (dataset.match(rdf.namedNode(uri)).size > 0 ? uri : '')


export const addEmptyResource = (resourceTemplateId, errorKey) => (dispatch) => dispatch(newSubject(null, resourceTemplateId, null, errorKey))
  .then((subject) => dispatch(newPropertiesFromTemplates(subject, false, errorKey))
    .then((properties) => {
      subject.properties = properties
      dispatch(addSubjectAction(subject))
      return subject
    }))

const recursiveResourceFromDataset = (subjectTerm, uri, resourceTemplateId, resourceKey, dataset,
  usedDataset, errorKey) => (dispatch) => dispatch(newSubject(uri, resourceTemplateId, resourceKey, errorKey))
  .then((subject) => dispatch(newPropertiesFromTemplates(subject, true, errorKey))
    .then((properties) => Promise.all(
      properties.map((property) => dispatch(newValuesFromDataset(subjectTerm, property, dataset, usedDataset, errorKey))
        .then((values) => {
          const compactValues = _.compact(values)
          if (!_.isEmpty(compactValues)) property.values = compactValues
          return compactValues
        })),
    )
      .then(() => {
        subject.properties = properties
        return subject
      })))

export const newSubject = (uri, resourceTemplateId, resourceKey, errorKey) => (dispatch) => {
  const key = shortid.generate()
  return dispatch(loadResourceTemplate(resourceTemplateId, errorKey))
    .then((subjectTemplate) => {
      // This handles if there was an error fetching resource template
      if (!subjectTemplate) {
        const err = new Error(`Unable to load ${resourceTemplateId}`)
        err.name = 'ResourceTemplateError'
        console.error(err.toString())
        throw err
      }

      return {
        key,
        uri: _.isEmpty(uri) ? null : uri,
        subjectTemplate,
        resourceKey: resourceKey || key,
        properties: [],
      }
    })
}

export const newPropertiesFromTemplates = (subject, noDefaults, errorKey) => (dispatch) => Promise.all(
  subject.subjectTemplate.propertyTemplates.map((propertyTemplate) => dispatch(newProperty(subject, propertyTemplate, noDefaults, errorKey))),
)

const newValuesFromDataset = (subjectTerm, property, dataset, usedDataset, errorKey) => (dispatch) => {
  // All quads for this property
  const quads = dataset.match(subjectTerm, rdf.namedNode(property.propertyTemplate.uri)).toArray()
  return Promise.all(quads.map((quad) => {
    if (property.propertyTemplate.type === 'resource') {
      return dispatch(newNestedResourceFromQuad(quad, property, dataset, usedDataset, errorKey))
    } if (quad.object.termType === 'NamedNode') {
      // URI
      return Promise.resolve(newUriFromQuad(quad, property, dataset, usedDataset))
    }
    // Literal
    return Promise.resolve(newLiteralFromQuad(quad, property, usedDataset))
  }))
}

const newNestedResourceFromQuad = (quad, property, dataset, usedDataset, errorKey) => (dispatch) => {
  // Only build this embedded resource if can find the resource template.
  // Multiple types may be provided.
  const typeQuads = dataset.match(quad.object, rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')).toArray()

  // Among the valueTemplateRefs, find all of the resource templates that match a type.
  // Ideally, only want 1 but need to handle other cases.
  return Promise.all(typeQuads.map(async (typeQuad) => dispatch(selectResourceTemplateId(property.propertyTemplate, typeQuad.object.value))))
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
      return dispatch(recursiveResourceFromDataset(quad.object, null, compactChildRtIds[0], property.resourceKey, dataset, usedDataset, errorKey))
        .then((subject) => newValueSubject(property, subject))
    })
}

const selectResourceTemplateId = (propertyTemplate, resourceURI, errorKey) => (dispatch) => Promise.all(
  // The keys are resource template ids. They may or may not be in state
  propertyTemplate.valueSubjectTemplateKeys.map(async (resourceTemplateId) => dispatch(loadResourceTemplate(resourceTemplateId, errorKey))
    .then((subjectTemplate) => (subjectTemplate.class === resourceURI ? resourceTemplateId : undefined))),
)

const newLiteralFromQuad = (quad, property, usedDataset) => {
  usedDataset.add(quad)
  return newLiteralValue(property, quad.object.value, quad.object.language)
}

const newUriFromQuad = (quad, property, dataset, usedDataset) => {
  const uri = quad.object.value
  usedDataset.add(quad)
  const labelQuads = dataset.match(quad.object, rdf.namedNode('http://www.w3.org/2000/01/rdf-schema#label')).toArray()
  let label = uri
  if (labelQuads.length > 0) {
    label = labelQuads[0].object.value // Use first match
    usedDataset.add(labelQuads[0])
  }
  return newUriValue(property, uri, label)
}

const newProperty = (subject, propertyTemplate, noDefaults, errorKey) => (dispatch) => {
  const key = shortid.generate()
  const property = {
    key,
    subject,
    resourceKey: subject.resourceKey,
    propertyTemplate,
    values: null,
    show: false,
  }
  if (!noDefaults && !_.isEmpty(property.propertyTemplate.defaults)) {
    property.values = property.propertyTemplate.defaults.map((defaultValue) => {
      if (property.propertyTemplate.type === 'uri') {
        return newUriValue(property, defaultValue.uri, defaultValue.label)
      }
      return newLiteralValue(property, defaultValue.literal, defaultValue.lang)
    })
    property.show = true
  }

  // If required, then expand the property.
  if (propertyTemplate.required) {
    property.show = true
    return dispatch(valuesForExpandedProperty(property, noDefaults, errorKey))
      .then((values) => {
        property.values = values
        return property
      })
  }

  return property
}

const valuesForExpandedProperty = (property, noDefaults, errorKey) => (dispatch) => {
  if (property.propertyTemplate.type === 'resource') {
    return Promise.all(property.propertyTemplate.valueSubjectTemplateKeys.map((resourceTemplateId) => dispatch(newSubject(null,
      resourceTemplateId, property.resourceKey, errorKey))
      .then((subject) => dispatch(newPropertiesFromTemplates(subject, noDefaults, errorKey))
        .then((properties) => {
          subject.properties = properties
          return newValueSubject(property, subject)
        }))))
  }
  return Promise.resolve([])
}

export const newSubjectCopy = (subjectKey, value) => (dispatch, getState) => {
  const subject = selectSubject(getState(), subjectKey)
  const newSubject = { ...subject }

  // Add to value
  if (value) value.valueSubject = newSubject

  // New key
  const key = shortid.generate()
  newSubject.key = key

  // Clear some values
  newSubject.uri = null
  delete newSubject.propertyKeys
  newSubject.properties = []

  // Add properties
  return Promise.all(subject.properties.map((property) => dispatch(newPropertyCopy(property.key, newSubject))))
    .then(() => newSubject)
}

const newPropertyCopy = (propertyKey, subject) => (dispatch, getState) => {
  const property = selectProperty(getState(), propertyKey)
  const newProperty = { ...property }

  // Add to subject
  subject.properties.push(newProperty)

  // New key
  const key = shortid.generate()
  newProperty.key = key

  // Clear some values
  delete newProperty.subjectKey
  newProperty.subject = subject
  delete newProperty.valueKeys
  newProperty.values = property.valueKeys === null ? null : []

  // Add values
  if (property.values) {
    return Promise.all(property.values.map((value) => dispatch(newValueCopy(value.key, newProperty))))
      .then(() => newProperty)
  }
  return newProperty
}

const newValueCopy = (valueKey, property) => (dispatch, getState) => {
  const value = selectValue(getState(), valueKey)
  const newValue = { ...value }

  // Add to property
  property.values.push(newValue)

  // New key
  const key = shortid.generate()
  newValue.key = key

  // Clear some values
  delete newValue.propertyKey
  newValue.property = property
  delete newValue.valueSubjectKey
  newValue.valueSubject = null

  if (value.valueSubject) {
    return dispatch(newSubjectCopy(value.valueSubject.key, newValue))
      .then(() => newValue)
  }

  return newValue
}

export const fetchResource = (uri, errorKey) => (dispatch) => {
  return fetch(uri, {
    headers: { 'Accept': 'application/json' }
  })
  .then((resp) => {
    if(! resp.ok) {
      dispatch(addError(errorKey, `Error retrieving resource: ${resp.statusText}`))
      return [null, null]
    }
    return resp.json()
      .then((response) => {
        return Promise.all([datasetFromJsonld(response.data), Promise.resolve(response)])
      })
      .catch((err) => {
        console.error(err)
        dispatch(addError(errorKey, `Error parsing resource: ${err.toString()}`))
        return [null, null]
      })
  })
  .catch((err) => {
    console.error(err)
    dispatch(addError(errorKey, `Error retrieving resource: ${err.toString()}`))
    return [null, null]
  })
}
