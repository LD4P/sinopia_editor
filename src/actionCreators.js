// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceStarted, retrieveResourceFinished,
  retrieveResourceTemplateStarted, retrieveResourceTemplateFinished,
  rootResourceTemplateLoaded, retrieveError, searchStarted, searchFinished
} from 'actions/index'
import { updateRDFResource, getResourceTemplate, loadRDFResource, getSearchResults } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import validateResourceTemplate from 'ResourceTemplateValidator'
import GraphBuilder from 'GraphBuilder'
import N3Parser from 'n3/lib/N3Parser'
import rdf from 'rdf-ext'

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

export const retrieveSearchResults = queryString => (dispatch) => {
  dispatch(searchStarted())
  return getSearchResults(queryString)
    .then((response) => {
      console.log("RESPONSE: ", response)
      dispatch(searchFinished(queryString, response))
    })
}