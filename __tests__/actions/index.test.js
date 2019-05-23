// Copyright 2018 Stanford University see Apache2.txt for license

import * as actions from '../../src/actions/index'

describe('setItems actions', () => {
  it('setItems should create SET_ITEMS action', () => {
    expect(actions.setItems({id:"Instance of", items: [{content: "food", id: 0}]})).toEqual({
      type: 'SET_ITEMS',
      payload: {id:"Instance of", items: [{content: "food", id: 0}]}
    })
  })

  it('removeItem should create REMOVE_ITEM action', () => {
    expect(actions.removeItem({id:0, label: "Instance of"})).toEqual({
      type: 'REMOVE_ITEM',
      payload: {id: 0, label: "Instance of"}
    })
  })

  it('setLang should create SET_LANG action', () => {
    expect(actions.setLang({id:"Instance of", items: [{label: "food", id: "http://uri1", uri: "URI"}]})).toEqual({
      type: 'SET_LANG',
      payload: {id:"Instance of", items: [{label: "food", id: "http://uri1", uri:"URI"}]}
    })
  })

})

describe('getLD action', () => {
  it('getLD should create GENERATE_LD action', () => {
    const inputs = { literals: {id: "Instance of",
                                items: [{ id: 0,
                                          content: "A Work"}]},
                     lookups: {id: "http://example.com/1234",
                               uri: "http://example.com/1234",
                               label: "An example"}
    }
    expect(actions.getLD(inputs)).toEqual({
      type: 'GENERATE_LD',
      payload: inputs
    })
  })
})

describe ('authentication actions', () => {
  it('authenticationFailure should create AUTHENTICATION_FAILURE action', () => {
    const authenticationResult = { a_payload: 'field' }
    expect(actions.authenticationFailure(authenticationResult)).toEqual({
      type: 'AUTHENTICATION_FAILURE',
      payload:authenticationResult
    })
  })

  it('authenticationSuccess should create AUTHENTICATION_SUCCESS action', () => {
    const authenticationResult = { a_payload: 'field' }
    expect(actions.authenticationSuccess(authenticationResult)).toEqual({
      type: 'AUTHENTICATION_SUCCESS',
      payload:authenticationResult
    })
  })

  it('signOutSuccess should create SIGN_OUT_SUCCESS action', () => {
    expect(actions.signOutSuccess()).toEqual({
      type: 'SIGN_OUT_SUCCESS'
    })
  })
})

describe('initializes the Redux State', () => {
  it('should return Redux state based on SET_RESOURCE_TEMPLATE action', () => {
    expect(actions.setResourceTemplate({}, { reduxPath: ['http://sinopia.io/example']})).toEqual({
      type: 'SET_RESOURCE_TEMPLATE',
      payload: {}
    })
  })
})
