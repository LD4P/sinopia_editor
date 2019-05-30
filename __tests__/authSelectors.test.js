// Copyright 2019 Stanford University see LICENSE for license

import { getCurrentUser, getCurrentSession, getAuthenticationError, getAuthenticationState } from '../src/authSelectors';

describe('getCurrentUser', () => {
  const currentUser = { hello: 'world' }

  const state = {
    authenticate: {
      authenticationState: {
        currentUser: currentUser
      }
    }
  };

  it('returns user', () => {
    expect(getCurrentUser(state)).toBe(currentUser)
  })
})

describe('getCurrentSession', () => {
  const currentSession = { hello: 'world' }

  const state = {
    authenticate: {
      authenticationState: {
        currentSession: currentSession
      }
    }
  };

  it('returns currentSession', () => {
    expect(getCurrentSession(state)).toBe(currentSession)
  })
})

describe('getAuthenticationError', () => {
  const authenticationError = { hello: 'world' }

  const state = {
    authenticate: {
      authenticationState: {
        authenticationError: authenticationError
      }
    }
  };

  it('returns authentication error', () => {
    expect(getAuthenticationError(state)).toBe(authenticationError)
  })
})

describe('getAuthenticationState', () => {
  const authenticationState = { authenticationError: 'broken' }

  const state = {
    authenticate: {
      authenticationState: authenticationState
    }
  };

  it('returns a copy of the authentication state', () => {
    const result = getAuthenticationState(state)
    expect(result).not.toBe(authenticationState)
    expect(result).toEqual(authenticationState)
  })
})
