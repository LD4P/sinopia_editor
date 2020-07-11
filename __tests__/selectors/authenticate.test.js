// Copyright 2019 Stanford University see LICENSE for license

import {
  selectAuthenticationError, selectCurrentSession, selectCurrentUser,
} from 'selectors/authenticate'
import { createState } from 'stateUtils'

describe('selectCurrentUser', () => {
  const currentUser = { hello: 'world' }
  const state = createState({ notAuthenticated: true })
  state.authenticate.authenticationState = { currentUser }

  it('returns user', () => {
    expect(selectCurrentUser(state)).toBe(currentUser)
  })
})

describe('selectCurrentSession', () => {
  const currentSession = { hello: 'world' }

  const state = createState({ notAuthenticated: true })
  state.authenticate.authenticationState = { currentSession }

  it('returns currentSession', () => {
    expect(selectCurrentSession(state)).toBe(currentSession)
  })
})

describe('selectAuthenticationError', () => {
  const authenticationError = { hello: 'world' }

  const state = createState({ notAuthenticated: true })
  state.authenticate.authenticationState = { authenticationError }

  it('returns authentication error', () => {
    expect(selectAuthenticationError(state)).toBe(authenticationError)
  })
})
