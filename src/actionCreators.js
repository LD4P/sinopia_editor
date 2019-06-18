import {
  authenticationFailure, authenticationSuccess, signOutSuccess, updateStarted, updateFinished,
} from 'actions/index'
import { updateRDFResource } from 'sinopiaServer'
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
