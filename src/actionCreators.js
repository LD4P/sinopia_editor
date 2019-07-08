// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceTemplateStarted, rootResourceTemplateLoaded,
  retrieveError, setResource, setResourceTemplate
} from 'actions/index'
import { updateRDFResource, getResourceTemplate } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import validateResourceTemplate from 'ResourceTemplateValidator'
import GraphBuilder from 'GraphBuilder'
import { isResourceWithValueTemplateRef } from 'Utilities'
import shortid from 'shortid'
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


// A think that walks the resource, loads resource templates, and stubs out properties
const stubResource = (dispatch, state) => {
    const newResource = {...state['selectorReducer']['resource']}
    const rootResourceTemplateId = Object.keys(newResource)[0]
    const rootResource = newResource[rootResourceTemplateId]
    const resourceTemplate = state['selectorReducer']['entities']['resourceTemplates'][rootResourceTemplateId]
    // const rootResourceTemplateId = newResource[]
    // console.log(rootResourceTemplateId)
    //stubResourceTemplate(newResource.keys()[0])
    // console.log('old resource')
    // console.log(newResource)
    stubResourceProperties(rootResourceTemplateId, rootResource, resourceTemplate, dispatch).then((resourceProperties) => {
      newResource[rootResourceTemplateId] = resourceProperties
      // console.log('new resource')
      // console.log(newResource)
      dispatch(setResource(newResource))
    })

}

const stubResourceProperties = async (resourceTemplateId, resource, existingResourceTemplate, dispatch) => {
  // console.log(resourceTemplateId)
  // console.log(resource)
  const newResource = {...resource}
  // let resourceTemplatePromise
  // if (existingResourceTemplate) {
    // resourceTemplatePromise = existingResourceTemplatePromise(existingResourceTemplate)
  // } else {
  const resourceTemplate = existingResourceTemplate || await fetchResourceTemplate(resourceTemplateId, dispatch)
  // }
  // const resourceTemplate = existingResourceTemplate || fetchResourceTemplate(resourceTemplateId, dispatch)
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
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
  })
  // if (resourceTemplate) {
  //   resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
  //     if (newResource[propertyTemplate.propertyURI] === undefined) {
  //       newResource[propertyTemplate.propertyURI] = {}
  //       // TODO: Handle defaults
  //     }
  //   })
  // }
  return newResource
}

// const existingResourceTemplatePromise = async (existingResourceTemplate) => {
  // return existingResourceTemplate
// }

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
