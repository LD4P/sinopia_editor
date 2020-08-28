import { addTemplateHistory } from 'actions/templates'
import { clearErrors, addError } from 'actions/errors'
import { findRootResourceTemplateId } from 'utilities/Utilities'
import {
  addResourceFromDataset, addEmptyResource, newSubject,
  newSubjectCopy, newPropertiesFromTemplates, chooseURI,
} from './resourceHelpers'
import { fetchResource, putResource, postResource } from 'sinopiaApi'
import {
  selectProperty, selectValue, selectFullSubject,
} from 'selectors/resources'
import {
  addProperty as addPropertyAction,
  addValue as addValueAction, addSubject as addSubjectAction,
  showProperty, setBaseURL, setCurrentResource, saveResourceFinished,
  setUnusedRDF, loadResourceFinished, setResourceGroup,
} from 'actions/resources'
import { newValueSubject } from 'utilities/valueFactory'

/**
 * A thunk that loads an existing resource from Sinopia API and adds to state.
 * @return {boolean} true if successful
 */
export const loadResource = (currentUser, uri, errorKey, asNewResource) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  return fetchResource(uri)
    .then(([dataset, response]) => {
      if (!dataset) return false
      const resourceTemplateId = resourceTemplateIdFromDataset(uri, dataset)
      return dispatch(addResourceFromDataset(dataset, uri, resourceTemplateId, errorKey, asNewResource, response.group))
        .then(([resource, usedDataset]) => {
          const unusedDataset = dataset.difference(usedDataset)
          dispatch(setUnusedRDF(resource.key, unusedDataset.size > 0 ? unusedDataset.toCanonical() : null))
          dispatch(setCurrentResource(resource.key))
          if (!asNewResource) dispatch(loadResourceFinished(resource.key))
          return true
        })
        .catch((err) => {
          // ResourceTemplateErrors have already been dispatched.
          if (err.name !== 'ResourceTemplateError') {
            console.error(err)
            dispatch(addError(errorKey, `Error retrieving ${uri}: ${err.message}`))
          }
          return false
        })
    })
    .catch((err) => {
      console.error(err)
      dispatch(addError(errorKey, `Error retrieving ${uri}: ${err.message}`))
      return false
    })
}

/**
 * A thunk that creates a new resource from a resource template and adds to state.
 * @return {boolean} true if successful
 */
export const newResource = (resourceTemplateId, errorKey) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  return dispatch(addEmptyResource(resourceTemplateId, errorKey))
    .then((resource) => {
      dispatch(setCurrentResource(resource.key))
      dispatch(setUnusedRDF(resource.key, null))
      dispatch(addTemplateHistory(resourceTemplateId))
      // This will mark the resource has unchanged.
      dispatch(loadResourceFinished(resource.key))
      return true
    })
    .catch((err) => {
      // ResourceTemplateErrors have already been dispatched.
      if (err.name !== 'ResourceTemplateError') {
        console.error(err)
        dispatch(addError(errorKey, `Error creating new resource: ${err.message}`))
      }
      return false
    })
}

/**
 * A thunk that creates a new resource from an existing in-state resource and adds to state.
 */
export const newResourceCopy = (resourceKey) => (dispatch) => dispatch(newSubjectCopy(resourceKey))
  .then((newResource) => {
    dispatch(addSubjectAction(newResource))
    dispatch(setCurrentResource(newResource.key))
    dispatch(setUnusedRDF(newResource.key, null))
  })
  .catch((err) => {
    console.error(err)
  })

/**
 * A thunk that loads a resource from N3 data and adds to state.
 * @param {rdf.Dataset} dataset containing the resource.
 * @param {string} URI for the resource.
 * @param {string} resourceTemplateId if known.
 * @param {string} errorKey
 * @param {boolean} asNewResource if true, does not set URI for the resource.
 * @return {boolean} true if successful
 */
export const newResourceFromDataset = (dataset, uri, resourceTemplateId, errorKey, asNewResource) => (dispatch) => {
  const newResourceTemplateId = resourceTemplateId || resourceTemplateIdFromDataset(chooseURI(dataset, uri), dataset)
  return dispatch(addResourceFromDataset(dataset, uri, newResourceTemplateId, errorKey, asNewResource))
    .then(([resource, usedDataset]) => {
      const unusedDataset = dataset.difference(usedDataset)
      dispatch(setUnusedRDF(resource.key, unusedDataset.size > 0 ? unusedDataset.toCanonical() : null))
      dispatch(setCurrentResource(resource.key))
      if (!asNewResource) dispatch(loadResourceFinished(resource.key))
      return true
    })
    .catch((err) => {
      // ResourceTemplateErrors have already been dispatched.
      if (err.name !== 'ResourceTemplateError') {
        console.error(err)
        dispatch(addError(errorKey, `Error retrieving ${resourceTemplateId}: ${err.message}`))
      }
      return false
    })
}

const resourceTemplateIdFromDataset = (uri, dataset) => {
  const resourceTemplateId = findRootResourceTemplateId(uri, dataset)
  if (!resourceTemplateId) throw new Error('A single resource template must be included as a triple (http://sinopia.io/vocabulary/hasResourceTemplate)')
  return resourceTemplateId
}

// A thunk that publishes (saves) a new resource in Trellis
export const saveNewResource = (resourceKey, currentUser, group, errorKey) => (dispatch, getState) => {
  const resource = selectFullSubject(getState(), resourceKey)

  postResource(resource, currentUser, group)
    .then((resourceUrl) => {
      dispatch(setBaseURL(resourceKey, resourceUrl))
      dispatch(setResourceGroup(resourceKey, group))
      dispatch(saveResourceFinished(resourceKey))
    })
    .catch((err) => {
      console.error(err)
      dispatch(addError(errorKey, `Error saving: ${err.message}`))
    })
}

// A thunk that saves an existing resource in Trellis
export const saveResource = (resourceKey, currentUser, errorKey) => (dispatch, getState) => {
  const resource = selectFullSubject(getState(), resourceKey)

  putResource(resource, currentUser)
    .then(() => dispatch(saveResourceFinished(resourceKey)))
    .catch((err) => {
      console.error(err)
      dispatch(addError(errorKey, `Error saving: ${err.message}`))
    })
}

/**
 * A thunk that expands a property based on resource template and adds to state.
 * Note that this is NOT showing/hiding a property.
 */
export const expandProperty = (propertyKey, errorKey) => (dispatch, getState) => {
  const property = selectProperty(getState(), propertyKey)
  let promises
  if (property.propertyTemplate.type === 'resource') {
    promises = property.propertyTemplate.valueSubjectTemplateKeys.map((resourceTemplateId) => dispatch(newSubject(null,
      resourceTemplateId, property.resourceKey, {}, errorKey))
      .then((subject) => dispatch(newPropertiesFromTemplates(subject, false, errorKey))
        .then((properties) => {
          subject.properties = properties
          const newValue = newValueSubject(property, subject)
          return dispatch(addValueAction(newValue))
        })))
  } else {
    property.values = []
    promises = [dispatch(addPropertyAction(property))]
  }
  return Promise.all(promises)
    .then(() => dispatch(showProperty(property.key)))
}

/**
 * A thunk that removes a property from state (the opposite of expandProperty).
 * Note that this is NOT showing/hiding a property.
 */
export const contractProperty = (propertyKey) => (dispatch, getState) => {
  const property = selectProperty(getState(), propertyKey)
  property.values = null
  dispatch(addPropertyAction(property))
}

/**
 * A thunk that adds a new value subject that is based on an existing value subject (i.e., "add another").
 */
export const addSiblingValueSubject = (valueKey, errorKey) => (dispatch, getState) => {
  const value = selectValue(getState(), valueKey)
  return dispatch(newSubject(null, value.valueSubject.subjectTemplate.id, value.resourcKey, {}, errorKey))
    .then((subject) => dispatch(newPropertiesFromTemplates(subject, false, errorKey))
      .then((properties) => {
        subject.properties = properties
        const newValue = newValueSubject(value.property, subject)
        return dispatch(addValueAction(newValue, valueKey))
      }))
}
