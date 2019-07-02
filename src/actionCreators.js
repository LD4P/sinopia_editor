// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceTemplateStarted, rootResourceTemplateLoaded,
  resourceTemplateLoaded, retrieveError,
} from 'actions/index'
import { updateRDFResource, getResourceTemplate } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import GraphBuilder from 'GraphBuilder'

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

/**
 * A thunk that retrieves the root resource template.
 * This dispatches 'rootResourceTemplateLoaded' when loading is complete or
 * 'retrieveError' if it failed.
 */
export const fetchRootResourceTemplate = resourceTemplateId => (dispatch) => {
  dispatch(retrieveResourceTemplateStarted(resourceTemplateId))

  getResourceTemplate(resourceTemplateId, 'ld4p').then((response) => {
    dispatch(rootResourceTemplateLoaded(response.response.body))
  }).catch((err) => {
    console.error(err)
    dispatch(retrieveError(resourceTemplateId))
  })
}

/**
 * A thunk that retrieves a non-root resource template.
 * This dispatches 'resourceTemplateLoaded' when loading is complete or
 * 'retrieveError' if it failed.
 */
export const fetchResourceTemplate = resourceTemplateId => (dispatch) => {
  dispatch(retrieveResourceTemplateStarted(resourceTemplateId))
  console.log(`starting to get ${resourceTemplateId}`)

  getResourceTemplate(resourceTemplateId, 'ld4p').then((response) => {
    dispatch(resourceTemplateLoaded(response.response.body))
  }).catch((err) => {
    console.error(err)
    dispatch(retrieveError(resourceTemplateId))
  })
}
