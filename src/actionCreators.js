import { authenticationFailure, authenticationSuccess, signOutSuccess } from './actions/index'

export const authenticationFailed = (authenticationResult) => {
  return authenticationFailure(authenticationResult)
}

export const authenticationSucceeded = (authenticationResult) => {
  return authenticationSuccess(authenticationResult)
}

export const signedOut = () => {
  return signOutSuccess()
}
