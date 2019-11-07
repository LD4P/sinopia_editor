// Copyright 2019 Stanford University see LICENSE for license

import {
  getAuthenticationError, getAuthenticationState, getCurrentSession, getCurrentUser,
} from '../src/authSelectors'
import { createBlankState } from 'testUtils'

describe('getCurrentUser', () => {
  const currentUser = { hello: 'world' }
  const state = createBlankState()
  state.authenticate.authenticationState = { currentUser }

  it('returns user', () => {
    expect(getCurrentUser(state)).toBe(currentUser)
  })
})

describe('getCurrentSession', () => {
  const currentSession = { hello: 'world' }

  const state = createBlankState()
  state.authenticate.authenticationState = { currentSession }

  it('returns currentSession', () => {
    expect(getCurrentSession(state)).toBe(currentSession)
  })
})

describe('getAuthenticationError', () => {
  const authenticationError = { hello: 'world' }

  const state = createBlankState()
  state.authenticate.authenticationState = { authenticationError }

  it('returns authentication error', () => {
    expect(getAuthenticationError(state)).toBe(authenticationError)
  })
})

describe('getAuthenticationState', () => {
  const authenticationState = { authenticationError: 'broken' }

  const state = {
    authenticate: {
      authenticationState,
    },
  }

  it('returns a copy of the authentication state', () => {
    const result = getAuthenticationState(state)

    expect(result).not.toBe(authenticationState)
    expect(result).toEqual(authenticationState)
  })
})
