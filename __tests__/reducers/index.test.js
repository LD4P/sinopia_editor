// Copyright 2020 Stanford University see LICENSE for license

import { createReducer, setAppVersion } from 'reducers/index'

describe('setAppVersion()', () => {
  it('sets the version of the application', () => {
    const handlers = { SET_APP_VERSION: setAppVersion }

    const reducer = createReducer(handlers)

    // It would be impressive to get to version 2000.0.1
    const action = { type: 'SET_APP_VERSION', payload: '2000.0.1' }

    const oldState = {
      version: '3.0.0',
    }

    const newState = reducer(oldState, action)

    expect(newState.version).toStrictEqual('2000.0.1')
  })
})

describe('createReducer', () => {
  it('handles the initial state', () => {
    const oldState = {}
    const reducer = createReducer({})
    const action = {}

    const newState = reducer(oldState, action)

    expect(newState).toMatchObject({})
  })
})
