// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceTemplateStarted, rootResourceTemplateLoaded,
  retrieveError, setResource, setResourceTemplate, updateResource
} from 'actions/index'
import { updateRDFResource, getResourceTemplate } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import validateResourceTemplate from 'ResourceTemplateValidator'
import GraphBuilder from 'GraphBuilder'
import { isResourceWithValueTemplateRef } from 'Utilities'
import shortid from 'shortid'
import { findNode } from 'selectors/resourceSelectors'
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

// A thunk that retrieves the root resource template
export const fetchRootResourceTemplate = resourceTemplateId => (dispatch) => {
  dispatch(retrieveResourceTemplateStarted(resourceTemplateId))

  getResourceTemplate(resourceTemplateId, 'ld4p').then((response) => {
    // If resource template loads, then validate.
    const resourceTemplate = response.response.body
    const reason = validateResourceTemplate(resourceTemplate)
    if (reason) {
      dispatch(retrieveError(resourceTemplateId, reason))
    } else {
      dispatch(rootResourceTemplateLoaded(resourceTemplate))
    }
  }).catch((err) => {
    console.error(err)
    dispatch(retrieveError(resourceTemplateId))
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

// A thunk that expands a nested resource
export const expandResource = reduxPath => (dispatch, getState) => {
  const state = getState()
  const newResource = {...state.selectorReducer.resource}
  const nestedResource = findNode(state, reduxPath)
  const resourceTemplateId = reduxPath.slice(-2)[0]
  const propertyURI = reduxPath.slice(-1)[0]
  const resourceTemplate = state.selectorReducer.entities.resourceTemplates[resourceTemplateId]
  stubProperty(resourceTemplateId, resourceTemplate, nestedResource, propertyURI, dispatch).then((resourceProperties) => {
    dispatch(updateResource(reduxPath, resourceProperties))
  })
}


// A think that walks the resource, loads resource templates, and stubs out properties
const stubResource = (dispatch, state) => {
    const newResource = {...state.selectorReducer.resource}
    const rootResourceTemplateId = Object.keys(newResource)[0]
    const rootResource = newResource[rootResourceTemplateId]
    const resourceTemplate = state.selectorReducer.entities.resourceTemplates[rootResourceTemplateId]
    stubResourceProperties(rootResourceTemplateId, resourceTemplate, rootResource, dispatch).then((resourceProperties) => {
      newResource[rootResourceTemplateId] = resourceProperties
      dispatch(setResource(newResource))
    })

}

// For a single property of a resource, stub it out.
const stubProperty = async (resourceTemplateId, existingResourceTemplate, resource, propertyURI, dispatch) => {
  const newResource = {...resource}
  const resourceTemplate = existingResourceTemplate || await fetchResourceTemplate(resourceTemplateId, dispatch)
  const propertyTemplate = resourceTemplate.propertyTemplates.find((propertyTemplate) => {
    return propertyTemplate.propertyURI === propertyURI
  })
  // console.log('stubProperty', resourceTemplateId, propertyTemplate, resourceTemplate, propertyURI, existingResourceTemplate)
  if (isResourceWithValueTemplateRef(propertyTemplate)) {
    propertyTemplate.valueConstraint.valueTemplateRefs.forEach((resourceTemplateId) => {
      // Once components correctly use state, this doesn't need to await
      fetchResourceTemplate(resourceTemplateId, dispatch)
      if (newResource[propertyTemplate.propertyURI] === undefined) {
        // TODO: Handle defaults
        newResource[propertyTemplate.propertyURI] = {}
      }
      newResource[propertyTemplate.propertyURI][shortid.generate()] = {[resourceTemplateId]: {}}
    })
  } else {
    if (newResource[propertyTemplate.propertyURI] === undefined) {
      newResource[propertyTemplate.propertyURI] = {}
      // TODO: Handle defaults
    }
  }
  return newResource
}

// For a resource, stub out of its properties.
const stubResourceProperties = async (resourceTemplateId, existingResourceTemplate, resource, dispatch) => {
  const newResource = {...resource}
  const resourceTemplate = existingResourceTemplate || await fetchResourceTemplate(resourceTemplateId, dispatch)
  // Given the resource template for this resource
  // For each property template
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
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
        const nestedResource = Object.keys(newResource[propertyTemplate.propertyURI]).find((key) => {
          return _.first(Object.keys(newResource[propertyTemplate.propertyURI][key]))=== resourceTemplateId
        })
        if (nestedResource === undefined) {
          newResource[propertyTemplate.propertyURI][shortid.generate()] = {[resourceTemplateId]: {}}
        } else {
          const nestedResourceTemplate = await nestedResourceTemplatePromise
          const newNestedResource = await stubResourceProperties(resourceTemplateId, nestedResourceTemplate, nestedResource, dispatch)
        }
      })
    // If it is a property ref
    } else {
      if (newResource[propertyTemplate.propertyURI] === undefined) {
        newResource[propertyTemplate.propertyURI] = {}
        // TODO: Handle defaults
      } else {
        console.warn('already exists prop', newResource[propertyTemplate.propertyURI])
      }
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
