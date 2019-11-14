// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 8] */
/* eslint complexity: ["warn", 14] */

import {
  setResource, updateProperty,
  toggleCollapse, appendResource, setLastSaveChecksum,
  assignBaseURL, setUnusedRDF,
  saveResourceFinished, appendError, clearErrors, setCurrentResource,
} from 'actions/index'
import { fetchResourceTemplate } from 'actionCreators/resourceTemplates'
import { updateRDFResource, loadRDFResource, publishRDFResource } from 'sinopiaServer'
import { findResourceURI } from 'selectors/resourceSelectors'
import GraphBuilder from 'GraphBuilder'
import {
  isResourceWithValueTemplateRef, rdfDatasetFromN3, generateMD5,
} from 'Utilities'
import { defaultValuesFromPropertyTemplate } from 'utilities/propertyTemplates'
import shortid from 'shortid'
import ResourceStateBuilder from 'ResourceStateBuilder'
import _ from 'lodash'

// A thunk that updates (saves) an existing resource in Trellis
export const update = (resourceKey, currentUser, errorKey) => (dispatch, getState) => {
  const uri = findResourceURI(getState(), resourceKey)
  const rdf = new GraphBuilder(getState().selectorReducer, resourceKey).graph.toCanonical()
  return updateRDFResource(currentUser, uri, rdf)
    .then(() => dispatch(saveResourceFinished(resourceKey, generateMD5(rdf))))
    .catch(err => dispatch(appendError(errorKey, `Error saving ${uri}: ${err.toString()}`)))
}

// A thunk that loads an existing resource from Trellis
export const retrieveResource = (currentUser, uri, errorKey, asNewResource) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  return loadRDFResource(currentUser, uri)
    .then((response) => {
      const data = response.response.text
      return rdfDatasetFromN3(data).then((dataset) => {
        const builder = new ResourceStateBuilder(dataset, null)
        const resourceKey = shortid.generate()
        // This also returns the resource templates. Could they be used?
        // See https://github.com/LD4P/sinopia_editor/issues/1396
        const newURI = asNewResource ? undefined : uri
        return builder.buildState().then(([state, unusedDataset]) => dispatch(existingResourceFunc(state, newURI, resourceKey, errorKey))
          .then((result) => {
            const rdf = new GraphBuilder({ entities: { resources: { [resourceKey]: result[0] }, resourceTemplates: result[1] } }, resourceKey).graph.toCanonical()
            if (!asNewResource) dispatch(setLastSaveChecksum(resourceKey, generateMD5(rdf)))
            dispatch(setUnusedRDF(resourceKey, unusedDataset.toCanonical()))
            dispatch(setCurrentResource(resourceKey))
            return true
          }))
          .catch((err) => {
            if (err.name !== 'ResourceTemplateError') throw err
            return false
          })
      })
    }).catch((err) => {
      dispatch(appendError(errorKey, `Error retrieving ${uri}: ${err.toString()}`))
      return false
    })
}

// A thunk that publishes (saves) a new resource in Trellis
export const publishResource = (resourceKey, currentUser, group, errorKey) => (dispatch, getState) => {
  // Make a copy of state to prevent changes that will affect the publish.
  const state = _.cloneDeep(getState())
  const rdf = new GraphBuilder(state.selectorReducer, resourceKey).graph.toCanonical()

  return publishRDFResource(currentUser, rdf, group).then((result) => {
    const resourceUrl = result.response.headers.location
    dispatch(assignBaseURL(resourceKey, resourceUrl))
    dispatch(saveResourceFinished(resourceKey, generateMD5(rdf)))
  }).catch((err) => {
    dispatch(appendError(errorKey, `Error saving: ${err.toString()}`))
  })
}

// A thunk that stubs out a new resource
export const newResource = (resourceTemplateId, errorKey) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  const resource = {}
  resource[resourceTemplateId] = {}
  const resourceKey = shortid.generate()
  return stubResource(resource, true, undefined, resourceKey, errorKey, dispatch)
    .then((result) => {
      const rdf = new GraphBuilder({ entities: { resources: { [resourceKey]: result[0] }, resourceTemplates: result[1] } }, resourceKey).graph.toCanonical()
      dispatch(setLastSaveChecksum(resourceKey, generateMD5(rdf)))
      dispatch(setUnusedRDF(resourceKey, null))
      return true
    })
    .catch((err) => {
      if (err.name !== 'ResourceTemplateError') throw err
      return false
    })
}

// A thunk that stubs out an existing new resource
// Note that errors are not cleared here.
export const existingResource = (resource, unusedRDF, uri, errorKey) => (dispatch) => {
  const resourceKey = shortid.generate()
  return dispatch(existingResourceFunc(resource, uri, resourceKey, errorKey))
    .then(() => {
      dispatch(setUnusedRDF(resourceKey, unusedRDF))
      dispatch(setCurrentResource(resourceKey))
      return true
    })
    .catch((err) => {
      if (err.name !== 'ResourceTemplateError') throw err
      return false
    })
}

// A thunk that expands a nested resource for a property
export const expandResource = (reduxPath, errorKey) => (dispatch, getState) => {
  const state = getState()
  const resourceTemplateId = reduxPath.slice(-2)[0]
  const propertyURI = reduxPath.slice(-1)[0]
  const resourceTemplates = state.selectorReducer.entities.resourceTemplates
  const parentKeyReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  dispatch(stubResourceProperties(resourceTemplateId, resourceTemplates, {}, parentKeyReduxPath, true, false, propertyURI, errorKey))
    .then((result) => {
      dispatch(updateProperty(reduxPath, result[0][propertyURI], result[1]))
    })
    .catch((err) => {
      if (err.name !== 'ResourceTemplateError') throw err
    })
}

// A thunk that adds a resource as sibling of provided reduxPath
export const addResource = (reduxPath, errorKey) => (dispatch, getState) => {
  const state = getState()
  const resourceTemplateId = reduxPath.slice(-1)[0]
  const resourceTemplates = state.selectorReducer.entities.resourceTemplates
  const key = shortid.generate()
  const parentReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  const newKeyReduxPath = [...parentReduxPath, key]
  const newResourceReduxPath = [...newKeyReduxPath, resourceTemplateId]

  dispatch(stubResourceProperties(resourceTemplateId, resourceTemplates, {}, newKeyReduxPath, false, false, false, errorKey))
    .then((result) => {
      const addedResource = { [key]: { [resourceTemplateId]: result[0] } }
      dispatch(appendResource(newResourceReduxPath, addedResource, result[1]))
    })
    .catch((err) => {
      if (err.name !== 'ResourceTemplateError') throw err
    })
}

const existingResourceFunc = (resource, uri, resourceKey, errorKey) => dispatch => stubResource(resource, false, uri, resourceKey, errorKey, dispatch)
  .then((result) => {
    dispatch(setLastSaveChecksum(resourceKey, undefined))
    return result
  })

// Stubs out a root resource
const stubResource = (resource, useDefaults, uri, resourceKey, errorKey, dispatch) => {
  const newResource = { ...resource }
  const rootResourceTemplateId = Object.keys(newResource)[0]
  const rootResource = newResource[rootResourceTemplateId]
  if (uri) {
    rootResource.resourceURI = uri
  }
  // Note that {} for resourceTemplates clears the existing resource templates.
  return dispatch(stubResourceProperties(rootResourceTemplateId, {}, rootResource, ['entities', 'resources', resourceKey], useDefaults, false, false, errorKey))
    .then((result) => {
      newResource[rootResourceTemplateId] = result[0]
      dispatch(setResource(resourceKey, newResource, result[1]))
      return [newResource, result[1]]
    })
}

/**
 * For a resource, stub out of its properties.
 *
 * Private, but exporting for testing.
 *
 * Any resource templates that are needed by not in provided resource templates will be retrieved
 * and added to the returned resources templates.
 *
 * If there is an error retrieving a resource template, a ResourceTemplateError error will be thrown.
 *
 * @param {string} resourceTemplateId
 * @param {Object} resourceTemplates resource templates indexed by resource template id
 * @param {Object} resource existing values for the resource or {}
 * @param {Array<String>} reduxPath of the resource (ending in the resource key or "resource")
 * @param {boolean} useDefaults if true, use default values for property refs
 * @param {boolean} stubMandatoryOnly if true, only stub properties that are mandatory
 * @param {string} stubPropertyURIOnly limit stubbing to this single property or undefined
 * @return {Promise<[Object, Object]>} the stubbed resource, resource templates
 * @throws {ResourceTemplateError} if a resource template cannot be loaded or is not found
 */
export const stubResourceProperties = (resourceTemplateId, resourceTemplates,
  resource, reduxPath, useDefaults, stubMandatoryOnly, stubPropertyURIOnly, errorKey) => async (dispatch) => {
  const newResource = _.cloneDeep(resource)
  const newResourceReduxPath = [...reduxPath, resourceTemplateId]
  let newResourceTemplates = _.cloneDeep(resourceTemplates)
  let resourceTemplate
  if (newResourceTemplates[resourceTemplateId]) {
    resourceTemplate = newResourceTemplates[resourceTemplateId]
  } else {
    resourceTemplate = await dispatch(fetchResourceTemplate(resourceTemplateId, errorKey))
    newResourceTemplates[resourceTemplateId] = resourceTemplate
  }

  // This handles if there was an error fetching resource template
  if (!resourceTemplate) {
    const err = new Error(`Unable to load ${resourceTemplateId}`)
    err.name = 'ResourceTemplateError'
    console.error(err.toString())
    throw err
  }
  // Given the resource template for this resource
  // For each property template
  await Promise.all(
    resourceTemplate.propertyTemplates.map(async (propertyTemplate) => {
      const propertyURI = propertyTemplate.propertyURI
      if (stubPropertyURIOnly && stubPropertyURIOnly !== propertyURI) {
        return
      }
      const newResourcePropertyReduxPath = [...newResourceReduxPath, propertyURI]
      const isMandatory = propertyTemplate.mandatory === 'true'

      // Toggle if there is a value.
      if (newResource[propertyURI] !== undefined) {
        dispatch(toggleCollapse(newResourcePropertyReduxPath))
      }
      // If it is a value ref
      if (isResourceWithValueTemplateRef(propertyTemplate)) {
        if (stubMandatoryOnly && !isMandatory && newResource[propertyURI === undefined]) {
          return
        }

        if (newResource[propertyTemplate.propertyURI] === undefined) {
          newResource[propertyTemplate.propertyURI] = {}
        }

        // Determine if any of the valueTemplateRefs have existing values.
        // If any of the nested resources have values, then will want to add all.
        const anyExistingNestedResourceKeys = propertyTemplate.valueConstraint.valueTemplateRefs.some(
          resourceTemplateId => Object.keys(newResource[propertyTemplate.propertyURI]).find(
            key => _.first(Object.keys(newResource[propertyTemplate.propertyURI][key])) === resourceTemplateId,
          ) !== undefined,
        )

        // For each value template
        // Since these are promises, using Promise.all for https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        await Promise.all(
          propertyTemplate.valueConstraint.valueTemplateRefs.map(async (resourceTemplateId) => {
            // See if there is alread a <key> > <resource template id> for this resource template id
            const nestedResourceKeys = Object.keys(newResource[propertyTemplate.propertyURI]).filter(
              key => _.first(Object.keys(newResource[propertyTemplate.propertyURI][key])) === resourceTemplateId,
            )


            const newResourceKey = shortid.generate()
            if (_.isEmpty(nestedResourceKeys)) {
              if (!isMandatory && !stubPropertyURIOnly && !anyExistingNestedResourceKeys) {
                return
              }
              newResource[propertyTemplate.propertyURI][newResourceKey] = { [resourceTemplateId]: {} }
              dispatch(toggleCollapse(newResourcePropertyReduxPath))
              nestedResourceKeys.push(newResourceKey)
            }

            await Promise.all(
              nestedResourceKeys.map(async (nestedResourceKey) => {
                const newResourcePropertyValueReduxPath = [...newResourcePropertyReduxPath, nestedResourceKey]
                const nestedResource = newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId]
                const stubResult = await dispatch(stubResourceProperties(resourceTemplateId, newResourceTemplates,
                  nestedResource, newResourcePropertyValueReduxPath, useDefaults, isMandatory, false, errorKey))
                const newNestedResource = stubResult[0]
                newResourceTemplates = { ...newResourceTemplates, ...stubResult[1] }
                newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId] = newNestedResource
              }),
            )
          }),
        )
        // If it is a property ref
      } else if (newResource[propertyTemplate.propertyURI] === undefined) {
        newResource[propertyTemplate.propertyURI] = {}
        // Defaults
        const defaults = defaultValuesFromPropertyTemplate(propertyTemplate)
        if ((useDefaults && !_.isEmpty(defaults)) || isMandatory || stubPropertyURIOnly) {
          newResource[propertyTemplate.propertyURI].items = defaults
          dispatch(toggleCollapse(newResourcePropertyReduxPath))
        }
      }
    }),
  )
  return [newResource, newResourceTemplates]
}
