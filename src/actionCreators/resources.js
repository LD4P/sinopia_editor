// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 8] */
/* eslint complexity: ["warn", 14] */

import {
  retrieveResourceStarted, setResource, updateProperty,
  toggleCollapse, appendResource, setLastSaveChecksum,
  assignBaseURL, setUnusedRDF,
  setRetrieveResourceError, saveResourceStarted, setSaveResourceError,
  saveResourceFinished,
} from 'actions/index'
import { fetchResourceTemplate } from 'actionCreators/resourceTemplates'
import { updateRDFResource, loadRDFResource, publishRDFResource } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import GraphBuilder from 'GraphBuilder'
import {
  isResourceWithValueTemplateRef, rdfDatasetFromN3, generateMD5,
} from 'Utilities'
import { defaultValuesFromPropertyTemplate } from 'utilities/propertyTemplates'
import shortid from 'shortid'
import ResourceStateBuilder from 'ResourceStateBuilder'
import _ from 'lodash'

// A thunk that updates (saves) an existing resource in Trellis
export const update = currentUser => (dispatch, getState) => {
  dispatch(saveResourceStarted())

  const uri = rootResourceId(getState())
  const rdf = new GraphBuilder(getState().selectorReducer).graph.toCanonical()
  return updateRDFResource(currentUser, uri, rdf)
    .then(() => dispatch(saveResourceFinished(generateMD5(rdf))))
    .catch(err => dispatch(setSaveResourceError(uri, err.toString())))
}

// A thunk that loads an existing resource from Trellis
export const retrieveResource = (currentUser, uri) => (dispatch) => {
  // First dispatch: inform the app that loading has started
  dispatch(retrieveResourceStarted())
  // TODO: Handle error from retrieving resource, parsing, and building state
  // See https://github.com/LD4P/sinopia_editor/issues/1395
  return loadRDFResource(currentUser, uri)
    .then((response) => {
      const data = response.response.text
      return rdfDatasetFromN3(data).then((dataset) => {
        const builder = new ResourceStateBuilder(dataset, null)
        // This also returns the resource templates. Could they be used?
        // See https://github.com/LD4P/sinopia_editor/issues/1396
        return builder.buildState().then(([state, unusedDataset]) => existingResourceFunc(state, uri, dispatch).then((result) => {
          if (result !== undefined) {
            const rdf = new GraphBuilder({ resource: result[0], entities: { resourceTemplates: result[1] } }).graph.toCanonical()
            dispatch(setLastSaveChecksum(generateMD5(rdf)))
            dispatch(setUnusedRDF(unusedDataset.toCanonical()))
            return true
          }
          return false
        })).catch((err) => {
          dispatch(setRetrieveResourceError(uri, err.toString()))
          return false
        })
      })
    }).catch((err) => {
      dispatch(setRetrieveResourceError(uri, err.toString()))
      return false
    })
}

// A thunk that publishes (saves) a new resource in Trellis
export const publishResource = (currentUser, group) => (dispatch, getState) => {
  dispatch(saveResourceStarted()) // clears possible residual server error

  // Make a copy of state to prevent changes that will affect the publish.
  const state = _.cloneDeep(getState())
  const rdf = new GraphBuilder(state.selectorReducer).graph.toCanonical()

  return publishRDFResource(currentUser, rdf, group).then((result) => {
    const resourceUrl = result.response.headers.location
    dispatch(assignBaseURL(resourceUrl))
    dispatch(saveResourceFinished(generateMD5(rdf)))
  }).catch((err) => {
    dispatch(setSaveResourceError(null, err.toString()))
  })
}

// A thunk that stubs out a new resource
export const newResource = resourceTemplateId => (dispatch) => {
  const resource = {}
  resource[resourceTemplateId] = {}
  return stubResource(resource, true, undefined, dispatch).then((result) => {
    if (result !== undefined) {
      const rdf = new GraphBuilder({ resource: result[0], entities: { resourceTemplates: result[1] } }).graph.toCanonical()
      dispatch(setLastSaveChecksum(generateMD5(rdf)))
      dispatch(setUnusedRDF(null))
      return true
    }
    return false
  })
}

// A thunk that stubs out an existing new resource
export const existingResource = (resource, unusedRDF, uri) => dispatch => existingResourceFunc(resource, uri, dispatch).then((result) => {
  if (result !== undefined) {
    dispatch(setUnusedRDF(unusedRDF))
  }
})

// A thunk that expands a nested resource for a property
export const expandResource = reduxPath => (dispatch, getState) => {
  const state = getState()
  const resourceTemplateId = reduxPath.slice(-2)[0]
  const propertyURI = reduxPath.slice(-1)[0]
  const resourceTemplates = state.selectorReducer.entities.resourceTemplates
  const parentKeyReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  stubResourceProperties(resourceTemplateId, resourceTemplates, {}, parentKeyReduxPath, true, false, propertyURI, dispatch).then((result) => {
    if (result !== undefined) {
      dispatch(updateProperty(reduxPath, result[0][propertyURI], result[1]))
    }
  })
}

// A thunk that adds a resource as sibling of provided reduxPath
export const addResource = reduxPath => (dispatch, getState) => {
  const state = getState()
  const resourceTemplateId = reduxPath.slice(-1)[0]
  const resourceTemplates = state.selectorReducer.entities.resourceTemplates
  const key = shortid.generate()
  const addedResource = { [key]: { [resourceTemplateId]: {} } }
  const parentReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  const newKeyReduxPath = [...parentReduxPath, key]
  const newResourceReduxPath = [...newKeyReduxPath, resourceTemplateId]

  stubResourceProperties(resourceTemplateId, resourceTemplates, addedResource, newKeyReduxPath, false, false, false, dispatch).then((result) => {
    if (result !== undefined) {
      dispatch(appendResource(newResourceReduxPath, result[0], result[1]))
    }
  })
}

const existingResourceFunc = (resource, uri, dispatch) => stubResource(resource, false, uri, dispatch).then((result) => {
  if (result !== undefined) {
    dispatch(setLastSaveChecksum(undefined))
  }
  return result
})

// Stubs out a root resource
const stubResource = (resource, useDefaults, uri, dispatch) => {
  const newResource = { ...resource }
  const rootResourceTemplateId = Object.keys(newResource)[0]
  const rootResource = newResource[rootResourceTemplateId]
  if (uri) {
    rootResource.resourceURI = uri
  }
  // Note that {} for resourceTemplates clears the existing resource templates.
  return stubResourceProperties(rootResourceTemplateId, {}, rootResource, ['resource'], useDefaults, false, false, dispatch).then((result) => {
    if (result !== undefined) {
      newResource[rootResourceTemplateId] = result[0]
      dispatch(setResource(newResource, result[1]))
      return [newResource, result[1]]
    }
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
 * If there is an error retrieving a resource template, undefined will be returned.
 *
 * @param {string} resourceTemplateId
 * @param {Object} resourceTemplates resource templates indexed by resource template id
 * @param {Object} resource existing values for the resource or {}
 * @param {Array<String>} reduxPath of the resource (ending in the resource key or "resource")
 * @param {boolean} useDefaults if true, use default values for property refs
 * @param {boolean} stubMandatoryOnly if true, only stub properties that are mandatory
 * @param {string} stubPropertyURIOnly limit stubbing to this single property or undefined
 * @param {func} dispatch
 * @return {Promise<[Object, Object]>} the stubbed resource, resource templates
 */
export const stubResourceProperties = async (resourceTemplateId, resourceTemplates,
  resource, reduxPath, useDefaults, stubMandatoryOnly, stubPropertyURIOnly, dispatch) => {
  const newResource = _.cloneDeep(resource)
  const newResourceReduxPath = [...reduxPath, resourceTemplateId]
  let newResourceTemplates = _.cloneDeep(resourceTemplates)
  let resourceTemplate
  if (newResourceTemplates[resourceTemplateId]) {
    resourceTemplate = newResourceTemplates[resourceTemplateId]
  } else {
    resourceTemplate = await fetchResourceTemplate(resourceTemplateId, dispatch)
    newResourceTemplates[resourceTemplateId] = resourceTemplate
  }

  // This handles if there was an error fetching resource template
  if (!resourceTemplate) {
    console.error(`Unable to load ${resourceTemplateId}`)
    return
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
            const existingNestedResourceKey = Object.keys(newResource[propertyTemplate.propertyURI]).find(
              key => _.first(Object.keys(newResource[propertyTemplate.propertyURI][key])) === resourceTemplateId,
            )

            const newResourceKey = shortid.generate()
            if (existingNestedResourceKey === undefined) {
              if (!isMandatory && !stubPropertyURIOnly && !anyExistingNestedResourceKeys) {
                return
              }
              newResource[propertyTemplate.propertyURI][newResourceKey] = { [resourceTemplateId]: {} }
              dispatch(toggleCollapse(newResourcePropertyReduxPath))
            }
            const nestedResourceKey = existingNestedResourceKey || newResourceKey
            const newResourcePropertyValueReduxPath = [...newResourcePropertyReduxPath, nestedResourceKey]
            const nestedResource = newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId]
            const stubResult = await stubResourceProperties(resourceTemplateId, newResourceTemplates,
              nestedResource, newResourcePropertyValueReduxPath, useDefaults, isMandatory, false, dispatch)
            if (!stubResult) return
            const newNestedResource = stubResult[0]
            newResourceTemplates = { ...newResourceTemplates, ...stubResult[1] }
            newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId] = newNestedResource
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
