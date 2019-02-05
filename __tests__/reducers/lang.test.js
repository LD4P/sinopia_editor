import lang from '../../src/reducers/lang'

describe('changing the reducer state', () => {
  const item_one = { "id": "http://uri1", "uri": "http://uri1", "label": "selection1" }
  const item_two = { "id": "http://uri2", "uri": "http://uri2", "label": "selection2" }

  it('should handle initial state', () => {
    expect(
      lang(undefined, {})
    ).toEqual({formData: []})
  })



  it('should handle SET_LANG', () => {
    expect(
      lang({formData: []}, {
        type: 'SET_LANG',
        payload: {id:'Run the tests', items: [ item_one ]}
      })
    ).toEqual({
      "formData": [{
        "id": "Run the tests", "items": [ item_one ]
      }]
    })

    expect(
      lang({
        "formData": [{
          "id": "Run the tests", "items": [ item_one ]
        }]}, {
        type: 'SET_LANG',
        payload: {id: "Run the tests", items: [ item_two ]}
      })
    ).toEqual({
      "formData": [
        {"id": "Run the tests", "items": [ item_two ]}      
      ]
    })


    expect(
      lang({
        "formData": [{
          "id": "Run the tests", "items": [ item_one ]
        }]}, {
        type: 'SET_LANG',
        payload: {id: "add this!", items: [ item_two ]}
      })
    ).toEqual({
      "formData": [
        {"id": "Run the tests", "items": [ item_one ]},
        {"id": "add this!", "items": [ item_two ]}
      ]
    })
  })
})