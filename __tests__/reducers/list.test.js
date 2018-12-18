import list from '../../src/reducers/list'

describe('todos reducer', () => {
  const item_one = { "id": "http://uri1", "uri": "http://uri1", "label": "selection1" }
  const item_two = { "id": "http://uri2", "uri": "http://uri2", "label": "selection2" }
  const item_three = { "id": "http://uri3", "uri": "http://uri3", "label": "selection3" }

  it('should handle initial state', () => {
    expect(
      list(undefined, {})
    ).toEqual({formData: []})
  })

  it('should handle CHANGE_SELECTIONS', () => {
    expect(
      list({formData: []}, {
        type: 'CHANGE_SELECTIONS',
        payload: {id:'Run the tests', items: [ item_one ]}
      })
    ).toEqual({
      "formData": [{
        "id": "Run the tests", "items": [ item_one ]
      }]
    })

    expect(
      list({
        "formData": [{
          "id": "Run the tests", "items": [ item_one ]
        }]}, {
        type: 'CHANGE_SELECTIONS',
        payload: {id: "add this!", items: [ item_two ]}
      })
    ).toEqual({
      "formData": [
        {"id": "Run the tests", "items": [ item_one ]},
        {"id": "add this!", "items": [ item_two ]}
      ]
    })
  })

  it('handles the change when there are more than one items selected from a list', () => {
    expect(
      list({
        "formData": [
          {"id": "Run the tests", "items": [ item_one ]},
          {"id": "add this!", "items": [ item_two ]}
        ]}, {
        type: 'CHANGE_SELECTIONS',
        payload: {id: "add this!", items: [ item_two, item_three ]}
      })
    ).toEqual({
      "formData": [
        {"id": "Run the tests", "items": [ item_one ]},
        {"id": "add this!", "items": [ item_two, item_three ]}
      ]
    })
  })

  it('handles removing selections', () => {
    expect(
      list({
        "formData": [
          {"id": "Run the tests", "items": [ item_one ]},
          {"id": "remove items!", "items": [ item_two, item_three ]}
        ]}, {
        type: 'CHANGE_SELECTIONS',
        payload: {id: "remove items!", items: [ ]}
      })
    ).toEqual({
      "formData": [
        {"id": "Run the tests", "items": [ item_one ]},
        {"id": "remove items!", "items": [ ]}
      ]
    })
  })
})