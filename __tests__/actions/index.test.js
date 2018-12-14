import * as actions from '../../src/actions/index'

describe('setItems actions', () => {
  it('setItems should create SET_ITEMS action', () => {
    expect(actions.setItems({id:"Instance of", items: [{content: "food", id: 0}]})).toEqual({
      type: 'SET_ITEMS',
      payload: {id:"Instance of", items: [{content: "food", id: 0}]}
    })
  })
})

