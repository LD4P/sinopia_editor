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
        payload: {uri:'Run the tests', items: []}
      })
    ).toEqual({
      "formData": [{
        "uri": "Run the tests", "items": []
      }]
    })

    expect(
      literal({
        "formData": [{
          "uri": "Run the tests", "items": []
        }]}, {
        type: 'SET_ITEMS',
        payload: {uri: "add this!", items: []}
      })
    ).toEqual({
      "formData": [
        {"uri": "Run the tests", "items": []},
        {"uri": "add this!", "items": []}
    ]})
  })
  it('should handle REMOVE_ITEM', () => {
    expect(
      literal({formData: [{uri:"Test", items:[
        {content: "test content", id: 0},
        {content: "more content", id: 1}
        ]}]}, {
        type: 'REMOVE_ITEM',
        payload: {id: 0, label: "Test"}
      })
    ).toEqual({
      "formData": [{
        "uri": "Test", "items": [{content: "more content", id: 1}]
      }]
    })


    expect(
      literal({formData: [
        {uri:"Test", items:[{content: "test content", id: 0}]},
        {uri:"Statement", items:[{content: "more test content", id: 0}]}
      ]}, {
        type: 'REMOVE_ITEM',
        payload: {id: 0, label: "Statement"}
      })
    ).toEqual({
      "formData": [
        {"uri": "Test", "items": [{content: "test content", id: 0}]},
        {"uri": "Statement", "items": []}
      ]
    })
  })

  it('should handle REMOVE_ALL_CONTENT', () => {
    expect(
      literal({
        formData: [
          {id: 1, uri:"Test", items:[
            {content: "test content", id: 0},
            {content: "test content2", id: 1}
          ]},
          {id: 2, uri:"Test2", items:[
            {content: "test2 content", id: 0},
            {content: "test2 content2", id: 1}
          ]}
        ]},
        { type: 'REMOVE_ALL_CONTENT', payload: 1})
    ).toEqual({
      "formData": [
        {"id": 2, "uri": "Test2", "items": [{content: "test2 content", id: 0}, {content: "test2 content2", id: 1}]}
      ]
    })
  })
})

