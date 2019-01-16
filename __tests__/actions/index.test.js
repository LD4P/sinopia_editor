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
