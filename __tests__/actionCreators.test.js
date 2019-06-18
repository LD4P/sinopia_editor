// Copyright 2019 Stanford University see LICENSE for license

import {
  authenticationFailed, authenticationSucceeded, signedOut, update,
} from 'actionCreators'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'

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

describe('update', () => {
  const state = {
    selectorReducer: {
      entities: {
        resourceTemplates: {
          'sinopia:profile:bf2:Place': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/place',
          },
        },
      },
      resource: {
        'sinopia:profile:bf2:Place': {
          resourceURI: 'http://example.com/repository/stanford/12345',
        },
      },
    },
  }

  const currentUser = {
    getSession: jest.fn(),
  }

  it('dispatches actions when started and finished', async () => {
    server.updateRDFResource = jest.fn().mockResolvedValue(true)
    const dispatch = jest.fn()
    const getState = jest.fn().mockReturnValue(state)
    await update(currentUser)(dispatch, getState)
    expect(dispatch).toBeCalledWith({ type: 'UPDATE_STARTED' })
    expect(dispatch).toBeCalledWith({ type: 'UPDATE_FINISHED' })
  })
})
