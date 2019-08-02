// Copyright 2018 Stanford University see LICENSE for license

import * as actions from 'actions/index'

describe('itemsSelected()', () => {
  it('creates ITEMS_SELECTED action', () => {
    expect(actions.itemsSelected({ id: 'Instance of', items: [{ content: 'food', id: 0 }] })).toEqual({
      type: 'ITEMS_SELECTED',
      payload: { id: 'Instance of', items: [{ content: 'food', id: 0 }] },
    })
  })
})

describe('removeItem()', () => {
  it('creates REMOVE_ITEM action', () => {
    const reduxPath = ['resource', 'resourceTemplate:bf2:Note', 'http://example.com', 'items', 'abc123']
    expect(actions.removeItem(reduxPath)).toEqual({
      type: 'REMOVE_ITEM',
      payload: reduxPath,
    })
  })
})

describe('languageSelected()', () => {
  it('creates LANGUAGE_SELECTED action', () => {
    expect(actions.languageSelected({ id: 'Instance of', items: [{ label: 'food', id: 'http://uri1', uri: 'URI' }] })).toEqual({
      type: 'LANGUAGE_SELECTED',
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
