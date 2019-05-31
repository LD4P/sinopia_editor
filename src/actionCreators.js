import { authenticationFailure, authenticationSuccess, signOutSuccess } from './actions/index'

export const authenticationFailed = authenticationResult => authenticationFailure(authenticationResult)

export const authenticationSucceeded = authenticationResult => authenticationSuccess(authenticationResult)

export const signedOut = () => signOutSuccess()
