// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceStarted, retrieveResourceFinished,
  retrieveResourceTemplateStarted, retrieveResourceTemplateFinished,
  rootResourceTemplateLoaded, retrieveError, setResource, setResourceTemplate,
} from 'actions/index'
import { updateRDFResource, getResourceTemplate, loadRDFResource } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import validateResourceTemplate from 'ResourceTemplateValidator'
import GraphBuilder from 'GraphBuilder'
import N3Parser from 'n3/lib/N3Parser'
import rdf from 'rdf-ext'
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
  }).catch(() => dispatch(retrieveError(resourceTemplateId)))
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
  parseResource(uri, data)
    .then((store) => {
      resourceTemplatesToLoad(store).forEach(resourceTemplateId => dispatch(loadResourceTemplate(resourceTemplateId)))
    })
}

/**
 * A thunk that fetches the resource template
 */
const loadResourceTemplate = resourceTemplateId => (dispatch) => {
  // First dispatch: inform the app that loading has started
  dispatch(retrieveResourceTemplateStarted(resourceTemplateId))
  return getResourceTemplate(resourceTemplateId, 'ld4p')
    .then((response) => {
      dispatch(retrieveResourceTemplateFinished(resourceTemplateId, response.response.body))
    })
}

/**
 * @return {Array} a list of resourceTemplateIds that this resource depends on
 */
const resourceTemplatesToLoad = store => store
  .match(null, rdf.namedNode('http://www.w3.org/ns/prov#wasGeneratedBy'), null, null)
  .toArray().map(triple => triple.object.value)

/**
 * @param {string} uri the URI of the resource
 * @param {string} the raw data from the request to Trellis
 * @return {Promise} this promise resolves to the datastore with the triples provided in the  data.
 */
const parseResource = (uri, data) => new Promise((resolve) => {
  const parser = new N3Parser()
  const dataset = rdf.dataset()
  parser.parse(data,
    (error, quad) => {
      // the final time through this loop will be EOF and quad will be undefined
      if (quad) {
        dataset.add(quad)
      } else {
        // done parsing
        resolve(dataset)
      }
    })
})

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
