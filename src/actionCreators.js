import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
  updateStarted, updateFinished,
  retrieveResourceTemplateStarted, rootResourceTemplateLoaded,
  retrieveError,
} from 'actions/index'
import { updateRDFResource, getResourceTemplate } from 'sinopiaServer'
import { rootResourceId } from 'selectors/resourceSelectors'
import GraphBuilder from 'GraphBuilder'

export const authenticationFailed = authenticationResult => authenticationFailure(authenticationResult)

export const authenticationSucceeded = authenticationResult => authenticationSuccess(authenticationResult)

export const signedOut = () => signOutSuccess()

// A thunk that updates an existing resource in Trellis
export const update = currentUser => (dispatch, getState) => {
  // First dispatch: inform the app that updating has started
  dispatch(updateStarted())

  const uri = rootResourceId(getState())
  const rdf = new GraphBuilder(getState().selectorReducer).graph.toString()
  return updateRDFResource(currentUser, uri, rdf)
    .then(response => dispatch(updateFinished(response)))
}
// A thunk that retrieve the root resource template
export const fetchRootResourceTemplate = resourceTemplateId => (dispatch) => {
  dispatch(retrieveResourceTemplateStarted(resourceTemplateId))
  getResourceTemplate(resourceTemplateId, 'ld4p').then((response) => {
    dispatch(rootResourceTemplateLoaded(response.response.body))
  }).catch((err) => {
    console.error(err)
    dispatch(retrieveError(resourceTemplateId))
  })
}
