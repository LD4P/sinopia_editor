import literal from '../../src/reducers/literal'

describe('todos reducer', () => {
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
      ]
    })
  })
})

