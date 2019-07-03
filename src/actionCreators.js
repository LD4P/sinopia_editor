// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceTemplateStarted, rootResourceTemplateLoaded,
  retrieveError,
} from 'actions/index'
import { updateRDFResource, getResourceTemplate } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import validateResourceTemplate from 'ResourceTemplateValidator'
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
