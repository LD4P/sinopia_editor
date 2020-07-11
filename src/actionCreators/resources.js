import { addTemplateHistory } from 'actions/templates'
import { clearErrors, addError } from 'actions/errors'
import { updateRDFResource, loadRDFResource, publishRDFResource } from 'sinopiaServer'
import {
  rdfDatasetFromN3, generateMD5, findRootResourceTemplateId,
} from 'utilities/Utilities'
import {
  addResourceFromDataset, addEmptyResource, addSubject, addValueSubject,
  removeSubject, addSubjectCopy, addPropertiesFromTemplates,
} from './resourceHelpers'
import GraphBuilder from 'GraphBuilder'
import {
  selectProperty, selectNormProperty, selectNormValue, selectValue, selectFullSubject,
} from 'selectors/resources'
import {
  addProperty as addPropertyAction,
  removeValue as removeValueAction,
  showProperty,
  setBaseURL,
  setCurrentResource,
  setLastSaveChecksum,
  saveResourceFinished,
  setUnusedRDF,
} from 'actions/resources'


// A thunk that loads an existing resource from Trellis
export const loadResource = (currentUser, uri, errorKey, asNewResource) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  return loadRDFResource(currentUser, uri)
    .then((response) => {
      const data = response.response.text
      return dispatch(newResourceFromN3(data, uri, null, errorKey, asNewResource))
    })
}

// A thunk that stubs out a new resource
export const newResource = (resourceTemplateId, errorKey) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  return dispatch(addEmptyResource(resourceTemplateId, errorKey))
    .then((resource) => {
      dispatch(setCurrentResource(resource.key))
      const rdf = new GraphBuilder(resource).graph.toCanonical()
      dispatch(setLastSaveChecksum(resource.key, generateMD5(rdf)))
      dispatch(setUnusedRDF(resource.key, null))
      dispatch(addTemplateHistory(resourceTemplateId))
      return true
    })
    .catch((err) => {
      // ResourceTemplateErrors have already been dispatched.
      if (err.name !== 'ResourceTemplateError') {
        dispatch(addError(errorKey, `Error creating new resource: ${err.toString()}`))
      }
      return false
    })
}

// A thunk that copies an existing resource (in state) to  new resource
export const newResourceCopy = (resourceKey) => (dispatch) => {
  const newResource = dispatch(addResourceCopy(resourceKey))
  dispatch(setCurrentResource(newResource.key))
  const rdf = new GraphBuilder(newResource).graph.toCanonical()
  dispatch(setLastSaveChecksum(newResource.key, generateMD5(rdf)))
  dispatch(setUnusedRDF(newResource.key, null))
}

export const newResourceFromN3 = (data, uri, resourceTemplateId, errorKey, asNewResource) => (dispatch) => rdfDatasetFromN3(data)
  .then((dataset) => dispatch(addResourceFromDataset(dataset, uri, resourceTemplateId || resourceTemplateIdFromDataset(uri, dataset), errorKey, asNewResource))
    .then(([resource, usedDataset]) => {
      const graph = new GraphBuilder(resource).graph
      if (!asNewResource) {
        dispatch(setLastSaveChecksum(resource.key, generateMD5(graph.toCanonical())))
      }

      const unusedDataset = dataset.difference(usedDataset)
      dispatch(setUnusedRDF(resource.key, unusedDataset.size > 0 ? unusedDataset.toCanonical() : null))
      dispatch(setCurrentResource(resource.key))
      return true
    })
    .catch((err) => {
      // ResourceTemplateErrors have already been dispatched.
      if (err.name !== 'ResourceTemplateError') {
        dispatch(addError(errorKey, `Error retrieving ${uri}: ${err.toString()}`))
      }
      return false
    }))
  .catch((err) => {
    dispatch(addError(errorKey, `Error parsing: ${err.toString()}`))
    return false
  })

const resourceTemplateIdFromDataset = (uri, dataset) => {
  const resourceTemplateId = findRootResourceTemplateId(uri, dataset)
  if (!resourceTemplateId) throw 'A single resource template must be included as a triple (http://sinopia.io/vocabulary/hasResourceTemplate)'
  return resourceTemplateId
}

// A thunk that publishes (saves) a new resource in Trellis
export const saveNewResource = (resourceKey, currentUser, group, errorKey) => (dispatch, getState) => {
  const resource = selectFullSubject(getState(), resourceKey)
  const rdf = new GraphBuilder(resource).graph.toCanonical()

  return publishRDFResource(currentUser, rdf, group).then((result) => {
    const resourceUrl = result.response.headers.location
    dispatch(setBaseURL(resourceKey, resourceUrl))
    dispatch(saveResourceFinished(resourceKey, generateMD5(rdf)))
  }).catch((err) => {
    dispatch(addError(errorKey, `Error saving: ${err.toString()}`))
  })
}

// A thunk that saves an existing resource in Trellis
export const saveResource = (resourceKey, currentUser, errorKey) => (dispatch, getState) => {
  const resource = selectFullSubject(getState(), resourceKey)

  const rdfBuilder = new GraphBuilder(resource)
  return updateRDFResource(currentUser, resource.uri, rdfBuilder.toTurtle())
    .then(() => dispatch(saveResourceFinished(resourceKey, generateMD5(rdfBuilder.graph.toCanonical()))))
    .catch((err) => dispatch(addError(errorKey, `Error saving ${resource.uri}: ${err.toString()}`)))
}

export const expandProperty = (propertyKey, errorKey) => (dispatch, getState) => {
  const property = selectProperty(getState(), propertyKey)
  if (property.propertyTemplate.type === 'resource') {
    property.propertyTemplate.valueSubjectTemplateKeys.forEach((resourceTemplateId) => {
      dispatch(addSubject(null, resourceTemplateId, errorKey))
        .then(([subject, , propertyTemplates]) => {
          dispatch(addValueSubject(propertyKey, subject.key))
          dispatch(addPropertiesFromTemplates(subject.key, propertyTemplates, false))
        })
    })
  } else {
    property.valueKeys = []
    dispatch(addPropertyAction(property))
  }
  dispatch(showProperty(property.key))
}

export const contractProperty = (propertyKey) => (dispatch, getState) => {
  const property = selectNormProperty(getState(), propertyKey)
  // Remove each of the values.
  if (property.valueKeys !== null) {
    property.valueKeys.forEach((valueKey) => dispatch(removeValue(valueKey)))
  }
  property.valueKeys = null
  dispatch(addPropertyAction(property))
}

export const addSiblingValueSubject = (valueKey, errorKey) => (dispatch, getState) => {
  const value = selectValue(getState(), valueKey)
  dispatch(addSubject(null, value.valueSubject.subjectTemplate.id, errorKey))
    .then(([subject, , propertyTemplates]) => {
      dispatch(addValueSubject(value.propertyKey, subject.key, valueKey))
      dispatch(addPropertiesFromTemplates(subject.key, propertyTemplates, false))
    })
}

export const addResourceCopy = (resourceKey) => (dispatch) => dispatch(addSubjectCopy(resourceKey, true))

export const removeValue = (valueKey) => (dispatch, getState) => {
  const value = selectNormValue(getState(), valueKey)
  // Remove valueSubject
  if (value.valueSubjectKey) dispatch(removeSubject(value.valueSubjectKey))
  // Remove value
  dispatch(removeValueAction(valueKey))
}
