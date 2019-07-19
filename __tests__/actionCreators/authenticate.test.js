// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailed, authenticationSucceeded, signedOut,
} from 'actionCreators/authenticate'

describe('authenticationFailed', () => {
  const currentUser = { hello: 'world' }
  const errInfoauthenticate = { foo: 'bar' }

  const authResult = {
    currentUser,
    authenticationError: errInfoauthenticate,
  }

  it('returns the failure action', () => {
    expect(authenticationFailed(authResult).type).toEqual('AUTHENTICATION_FAILURE')
  })
})

describe('authenticationSucceeded', () => {
  const currentUser = { hello: 'world' }
  const sessionData = { foo: 'bar' }

  const authResult = {
    currentUser,
    currentSession: sessionData,
  }

  it('returns the success action', () => {
    expect(authenticationSucceeded(authResult).type).toEqual('AUTHENTICATION_SUCCESS')
  })
})

describe('signedOut', () => {
  it('returns the signed out action', () => {
    expect(signedOut().type).toEqual('SIGN_OUT_SUCCESS')
  })
})
