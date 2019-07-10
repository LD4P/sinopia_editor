// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 5] */

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceStarted, retrieveResourceTemplateStarted,
  retrieveError, setResource, setResourceTemplate, updateProperty,
  toggleCollapse, retrieveResourceFinished, appendResource
} from 'actions/index'

import { updateRDFResource, getResourceTemplate, loadRDFResource } from 'sinopiaServer'
import { rootResourceId, findNode } from 'selectors/resourceSelectors'
import validateResourceTemplate from 'ResourceTemplateValidator'
import GraphBuilder from 'GraphBuilder'
import { isResourceWithValueTemplateRef, rdfDatasetFromN3 } from 'Utilities'
import shortid from 'shortid'

import ResourceStateBuilder from 'ResourceStateBuilder'

const _ = require('lodash')

export const authenticationFailed = authenticationResult => authenticationFailure(authenticationResult)

export const authenticationSucceeded = authenticationResult => authenticationSuccess(authenticationResult)

export const signedOut = () => signOutSuccess()

// A thunk that updates an existing resource in Trellis
export const update = currentUser => (dispatch, getState) => {
  dispatch(updateStarted())

  const uri = rootResourceId(getState())
  const rdf = new GraphBuilder(getState().selectorReducer).graph.toString()
  return updateRDFResource(currentUser, uri, rdf)
    .then(response => dispatch(updateFinished(response)))
}

// A thunk that loads an existing resource from Trellis
export const retrieveResource = (currentUser, uri) => (dispatch) => {
  // First dispatch: inform the app that loading has started
  dispatch(retrieveResourceStarted())

  return loadRDFResource(currentUser, uri)
    .then((response) => {
      dispatch(retrieveResourceFinished(uri, response.response.text))
      // a thunk dispatching a thunk
      dispatch(loadRetrievedResource(uri, response.response.text))
    })
}

/**
 * Called after RDF has been retrieved from the server.
 * Dispatches loadResourceTemplate for each needed template
 * This converts the RDF to Redux state.
 */
export const loadRetrievedResource = (uri, data) => (dispatch) => {
  rdfDatasetFromN3(data).then((dataset) => {
    const builder = new ResourceStateBuilder(dataset, null)
    dispatch(existingResource(builder.state))
  })
}

// A thunk that stubs out a new resource
export const newResource = resourceTemplateId => (dispatch, getState) => {
  const resource = {}
  resource[resourceTemplateId] = {}
  dispatch(setResource(resource))
  stubResource(dispatch, getState())
}

// A thunk that stubs out an existing new resource
export const existingResource = resource => (dispatch, getState) => {
  dispatch(setResource(resource))
  stubResource(dispatch, getState())
}

// A thunk that expands a nested resource for a property
export const expandResource = reduxPath => (dispatch, getState) => {
  const state = getState()
  const nestedResource = findNode(state.selectorReducer, reduxPath)
  const resourceTemplateId = reduxPath.slice(-2)[0]
  const propertyURI = reduxPath.slice(-1)[0]
  const resourceTemplate = state.selectorReducer.entities.resourceTemplates[resourceTemplateId]
  stubProperty(resourceTemplateId, resourceTemplate, nestedResource, propertyURI, dispatch).then((resourceProperties) => {
    dispatch(updateProperty(reduxPath, resourceProperties))
  })
}

// A thunk that adds a resource as sibling of provided reduxPath
export const addResource = reduxPath => (dispatch, getState) => {
  const state = getState()
  const resourceTemplateId = reduxPath.slice(-1)[0]
  const resourceTemplate = state.selectorReducer.entities.resourceTemplates[resourceTemplateId]
  const parentPropertyURI = reduxPath.slice(-3)[0]
  const key = shortid.generate()
  const addedResource = {[key]: {[resourceTemplateId]: {}}}
  const parentReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  const parentPropertyNode = findNode(state.selectorReducer, parentReduxPath)
  const newReduxPath = [...parentReduxPath, key, resourceTemplateId]

  stubResourceProperties(resourceTemplateId, resourceTemplate, addedResource, newReduxPath, dispatch).then((resourceProperties) => {
    dispatch(appendResource(newReduxPath, resourceProperties))
  })
}


// Stubs out a root resource
const stubResource = (dispatch, state) => {
  const newResource = { ...state.selectorReducer.resource }
  const rootResourceTemplateId = Object.keys(newResource)[0]
  const rootResource = newResource[rootResourceTemplateId]
  const resourceTemplate = state.selectorReducer.entities.resourceTemplates[rootResourceTemplateId]
  stubResourceProperties(rootResourceTemplateId, resourceTemplate, rootResource, ['resource'], dispatch).then((resourceProperties) => {
    newResource[rootResourceTemplateId] = resourceProperties
    dispatch(setResource(newResource))
  })
}

// For a single property of a resource, stub it out.
const stubProperty = async (resourceTemplateId, existingResourceTemplate, resource, propertyURI, dispatch) => {
  const newResource = { ...resource }
  const resourceTemplate = existingResourceTemplate || await fetchResourceTemplate(resourceTemplateId, dispatch)
  const propertyTemplate = resourceTemplate.propertyTemplates.find(propertyTemplate => propertyTemplate.propertyURI === propertyURI)
  if (isResourceWithValueTemplateRef(propertyTemplate)) {
    propertyTemplate.valueConstraint.valueTemplateRefs.forEach((resourceTemplateId) => {
      // Once components correctly use state, this doesn't need to await
      fetchResourceTemplate(resourceTemplateId, dispatch)
      // See if there is alread a <key> > <resource template id> for this resource template id
      const nestedResource = Object.keys(newResource).find(key => _.first(Object.keys(newResource[key])) === resourceTemplateId)
      if (nestedResource === undefined) {
        // TODO: Handle defaults
        newResource[shortid.generate()] = { [resourceTemplateId]: {} }
      }
    })
  }

  return newResource
}

// For a resource, stub out of its properties.
const stubResourceProperties = async (resourceTemplateId, existingResourceTemplate, resource, reduxPath, dispatch) => {
  const newResource = _.cloneDeep(resource)
  const newResourceReduxPath = [...reduxPath, resourceTemplateId]
  const resourceTemplate = existingResourceTemplate || await fetchResourceTemplate(resourceTemplateId, dispatch)
  // Given the resource template for this resource
  // For each property template
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
    const propertyURI = propertyTemplate.propertyURI
    const newResourcePropertyReduxPath = [...newResourceReduxPath, propertyURI]
    if (newResource[propertyURI] !== undefined) {
      dispatch(toggleCollapse(newResourcePropertyReduxPath))
    }

    // If it is a value ref
    if (isResourceWithValueTemplateRef(propertyTemplate)) {
      if (newResource[propertyTemplate.propertyURI] === undefined) {
        // TODO: Handle defaults
        newResource[propertyTemplate.propertyURI] = {}
      }
      // For each value template
      propertyTemplate.valueConstraint.valueTemplateRefs.forEach(async (resourceTemplateId) => {
        const nestedResourceTemplatePromise = fetchResourceTemplate(resourceTemplateId, dispatch)
        // See if there is alread a <key> > <resource template id> for this resource template id
        const nestedResourceKey = Object.keys(newResource[propertyTemplate.propertyURI]).find(
          key => _.first(Object.keys(newResource[propertyTemplate.propertyURI][key])) === resourceTemplateId,
        )

        if (nestedResourceKey === undefined) {
          newResource[propertyTemplate.propertyURI][shortid.generate()] = { [resourceTemplateId]: {} }
        } else {
          const newResourcePropertyValueReduxPath = [...newResourcePropertyReduxPath, nestedResourceKey]
          const nestedResource = newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId]
          const nestedResourceTemplate = await nestedResourceTemplatePromise
          const newNestedResource = await stubResourceProperties(resourceTemplateId, nestedResourceTemplate,
            nestedResource, newResourcePropertyValueReduxPath, dispatch)
          newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId] = newNestedResource
        }
      })
    // If it is a property ref
    } else if (newResource[propertyTemplate.propertyURI] === undefined) {
      newResource[propertyTemplate.propertyURI] = {}
      // TODO: Handle defaults
    } else if (newResource[propertyTemplate.propertyURI] === undefined) {
      newResource[propertyTemplate.propertyURI] = {}
      // TODO: Handle defaults
    }
  })
  return newResource
}

const fetchResourceTemplate = (resourceTemplateId, dispatch) => {
  dispatch(retrieveResourceTemplateStarted(resourceTemplateId))

  return getResourceTemplate(resourceTemplateId, 'ld4p').then((response) => {
    // If resource template loads, then validate.
    const resourceTemplate = response.response.body
    const reason = validateResourceTemplate(resourceTemplate)
    if (reason) {
      dispatch(retrieveError(resourceTemplateId, reason))
    } else {
      dispatch(setResourceTemplate(resourceTemplate))
      return resourceTemplate
    }
  }).catch((err) => {
    console.error(err)
    dispatch(retrieveError(resourceTemplateId))
  })
}
