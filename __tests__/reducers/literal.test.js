import literal from '../../src/reducers/literal'

describe('literal reducer', () => {
  it('should handle initial state', () => {
    expect(
      literal(undefined, {})
    ).toEqual({formData: []})
  })

  it('should handle SET_ITEMS', () => {
    expect(
      literal({formData: []}, {
        type: 'SET_ITEMS',
        payload: {id:'Run the tests', items: []}
      })
    ).toEqual({
      "formData": [{
        "id": "Run the tests", "items": []
      }]
    })

    expect(
      literal({
        "formData": [{
          "id": "Run the tests", "items": []
        }]}, {
        type: 'SET_ITEMS',
        payload: {id: "add this!", items: []}
      })
    ).toEqual({
      "formData": [
        {"id": "Run the tests", "items": []},
        {"id": "add this!", "items": []}
    ]})
  })
  it('should handle REMOVE_ITEM', () => {
    expect(
      literal({formData: [{id:"Test", items:[
        {content: "test content", id: 0},
        {content: "more content", id: 1}
        ]}]}, {
        type: 'REMOVE_ITEM',
        payload: {id: 0, label: "Test"}
      })
    ).toEqual({
      "formData": [{
        "id": "Test", "items": [{content: "more content", id: 1}]
      }]
    })


    expect(
      literal({formData: [
        {id:"Test", items:[{content: "test content", id: 0}]},
        {id:"Statement", items:[{content: "more test content", id: 0}]}
      ]}, {
        type: 'REMOVE_ITEM',
        payload: {id: 0, label: "Statement"}
      })
    ).toEqual({
      "formData": [
        {"id": "Test", "items": [{content: "test content", id: 0}]},
        {"id": "Statement", "items": []}
      ]
    })
  })
})

