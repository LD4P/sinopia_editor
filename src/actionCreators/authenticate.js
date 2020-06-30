// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 6] */

import {
  authenticationFailure, authenticationSuccess, signOutSuccess,
} from 'actions/authenticate'

export const authenticationFailed = (authenticationResult) => authenticationFailure(authenticationResult)

export const authenticationSucceeded = (authenticationResult) => authenticationSuccess(authenticationResult)

export const signedOut = () => signOutSuccess()
