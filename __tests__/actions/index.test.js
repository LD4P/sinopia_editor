// Copyright 2018 Stanford University see LICENSE for license

import * as actions from 'actions/index'

describe('setItems()', () => {
  it('creates SET_ITEMS action', () => {
    expect(actions.setItems({ id: 'Instance of', items: [{ content: 'food', id: 0 }] })).toEqual({
      type: 'SET_ITEMS',
      payload: { id: 'Instance of', items: [{ content: 'food', id: 0 }] },
    })
  })
})


describe('removeItem()', () => {
  it('creates REMOVE_ITEM action', () => {
    const reduxPath = ['resource', 'resourceTemplate:bf2:Note', 'http://example.com']
    expect(actions.removeItem(reduxPath, 0)).toEqual({
      type: 'REMOVE_ITEM',
      payload: { reduxPath, id: 0 },
    })
  })
})

describe('setLang()', () => {
  it('creates SET_LANG action', () => {
    expect(actions.setLang({ id: 'Instance of', items: [{ label: 'food', id: 'http://uri1', uri: 'URI' }] })).toEqual({
      type: 'SET_LANG',
      payload: { id: 'Instance of', items: [{ label: 'food', id: 'http://uri1', uri: 'URI' }] },
    })
  })
})

describe('authentication actions', () => {
  it('authenticationFailure should create AUTHENTICATION_FAILURE action', () => {
    const authenticationResult = { a_payload: 'field' }

    expect(actions.authenticationFailure(authenticationResult)).toEqual({
      type: 'AUTHENTICATION_FAILURE',
      payload: authenticationResult,
    })
  })

  it('authenticationSuccess should create AUTHENTICATION_SUCCESS action', () => {
    const authenticationResult = { a_payload: 'field' }

    expect(actions.authenticationSuccess(authenticationResult)).toEqual({
      type: 'AUTHENTICATION_SUCCESS',
      payload: authenticationResult,
    })
  })

  it('signOutSuccess should create SIGN_OUT_SUCCESS action', () => {
    expect(actions.signOutSuccess()).toEqual({
      type: 'SIGN_OUT_SUCCESS',
    })
  })
})
