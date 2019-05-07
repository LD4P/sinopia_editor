import { removeAllContent, removeMyItem, setMyItems, setMySelections } from '../../src/reducers/inputs'

describe('literal reducer functions', () => {

  it('SET_ITEMS adds item to state', () => {
    const literalSetItems = setMyItems({ "resourceTemplate:Monograph:Instance": {
      'http://schema.org/name': { items: [] }
    }}, {
      type: 'SET_ITEMS',
      payload: {
        rtId: 'resourceTemplate:Monograph:Instance',
        uri: 'http://schema.org/name',
        reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name'],
        items: [ { id: 0, content: 'Run the tests'} ]
      }
    })
    expect(literalSetItems).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [{ id: 0, content: 'Run the tests'}]
        }
      }
    })
  })

  it('SET_ITEMS adds item to an empty state', () => {
    const emptyState = setMyItems({},
     {
       type: 'SET_ITEMS',
       payload: {
         rtId: 'resourceTemplate:Monograph:Instance',
         uri: 'http://schema.org/name',
         reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name'],
         items: [ { id: 0, content: 'Run the tests'} ]
       }
     })
     expect(emptyState).toEqual({
       "resourceTemplate:Monograph:Instance": {
         'http://schema.org/name': {
           items: [{ id: 0, content: 'Run the tests'}]
         }
       }
     })
  })

  it('SET_ITEMS appends item to populated state', () => {
    expect(
      setMyItems({ "resourceTemplate:Book": {} },
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: "resourceTemplate:Monograph:Instance",
          uri: 'http://schema.org/description',
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/description'],
          items: [ { id: 2, content: "add this!"}]
        }
      })
    ).toEqual({
       "resourceTemplate:Book": {},
      'resourceTemplate:Monograph:Instance': {
        "http://schema.org/description": {
          items: [{ id: 2, content: "add this!"}]}
      }
    })
  })

  it('SET_ITEMS creates intermediate objects in the Redux state if present in reduxPath', () => {
    const createPersonResult =  setMyItems({
      "resourceTemplate:Monograph:Instance": {
        "abcdeCode": {
          "http://schema.org/name": "A fun name"
        }
      }
    },
    {
      type: 'SET_ITEMS',
      payload: {
        rtId: "resourceTemplate:Monograph:Instance",
        uri: 'http://schema.org/description',
        reduxPath: ['resourceTemplate:Monograph:Instance',
                    "abcdeCode",
                    'http://schema.org/Person',
                    'http://schema.org/givenName'],
        items: [ { id: 2, content: "Melissa"}]
      }
    })
    expect(createPersonResult).toEqual({
      "resourceTemplate:Monograph:Instance": {
        "abcdeCode": {
          "http://schema.org/name": "A fun name",
          "http://schema.org/Person": {
            "http://schema.org/givenName": {
              "items": [ { id: 2, content: "Melissa"}]
            }
          }
        }
      }
    })
  })

  it('SET_ITEMS adds new item to state when state has existing selector for another literal', () => {
    expect(
      setMyItems({ "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [{ id: 1, content: "Run the tests" }],
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name']
        },
        'http://schema.org/description': {
          items: [],
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/description']
        }
        }
      },
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: "resourceTemplate:Monograph:Instance",
          uri: 'http://schema.org/description',
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/description'],
          items: [ { id: 2, content: "add this!"}]
        }
      })
    ).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [{ id: 1, content: 'Run the tests'}],
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name']
        },
        'http://schema.org/description': {
          items: [{ id: 2, content: "add this!"}],
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/description']
        }
      }
    })
  })

  it('CHANGE_SELECTIONS adds items to state', () => {
    const listSetSelections = setMySelections({ "resourceTemplate:Monograph:Instance": {
      'http://schema.org/name': { items: [] }
    }}, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'abc123',
        uri: 'http://schema.org/name',
        reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name'],
        items: [ { id: 0, label: 'Run the tests', uri: 'http://schema.org/abc'} ]
      }
    })
    expect(listSetSelections).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [{ id: 0, label: 'Run the tests', uri: 'http://schema.org/abc'}]
        }
      }
    })
  })

  it('CHANGE_SELECTIONS overwites items in  current state', () => {
    const listSetSelections = setMySelections({ "resourceTemplate:Monograph:Instance": {
      'http://schema.org/name': { items: [{ id: 0, label: 'Run the tests', uri: 'http://schema.org/abc'}] }
    }}, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'def456',
        uri: 'http://schema.org/name',
        reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name'],
        items: [
          { id: 0, label: 'Run the tests', uri: 'http://schema.org/abc'},
          { id: 1, label: 'See if they pass', uri: 'http://schema.org/def'}
        ]
      }
    })
    expect(listSetSelections).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [
            { id: 0, label: 'Run the tests', uri: 'http://schema.org/abc'},
            { id: 1, label: 'See if they pass', uri: 'http://schema.org/def'}
          ]
        }
      }
    })
  })

  it('CHANGE_SELECTIONS removes all items in  current state by overwriting with an empty object', () => {
    const listSetSelections = setMySelections({ "resourceTemplate:Monograph:Instance": {
      'http://schema.org/name': {
        items: [
          { id: 0, label: 'Run the tests', uri: 'http://schema.org/abc'},
          { id: 1, label: 'See if they pass', uri: 'http://schema.org/def'}
        ]
      }
    }}, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'nomatter',
        uri: 'http://not/importanr',
        reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name'],
        items: []
      }
    })
    expect(listSetSelections).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {items: []}
      }
    })
  })

  it('REMOVE_ITEM removes an item from state', () => {
    expect(removeMyItem({
      "resourceTemplate:Monograph:Instance": {
       'http://schema.org/name': {
         items: [
           {content: "test content", id: 0},
           {content: "more content", id: 1}
         ]
       }
      }
    },
    {
      type: 'REMOVE_ITEM',
      payload: {
        id: 0,
        rtId: "resourceTemplate:Monograph:Instance",
        reduxPath: ["resourceTemplate:Monograph:Instance", "http://schema.org/name"],
        uri: "http://schema.org/name",
        content: "test content"
      }
    })).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [{ id: 1, content: "more content" }]
        }
      }
    })
   })

  it('Calling REMOVE_ITEMS with non-existent id does not change state', () => {
    expect(removeMyItem({
      "resourceTemplate:Monograph:Instance": {
       'http://schema.org/name': {
         items: [
           {content: "Test", id: 1},
           {content: "Statement", id: 2}
         ]
       }
      }
    },
    {
      type: 'REMOVE_ITEM',
      payload: {
        id: 0,
        uri: "http://schema.org/name",
        content: "test content",
        reduxPath: ["resourceTemplate:Monograph:Instance", "http://schema.org/name"]
      }
    })
   ).toEqual({
    "resourceTemplate:Monograph:Instance": {
     'http://schema.org/name': {
       items: [
         {content: "Test", id: 1},
         {content: "Statement", id: 2}
       ]
     }
    }
   })
  })

  it('should handle REMOVE_ALL_CONTENT', () => {
    expect(
      removeAllContent({
        "resourceTemplate:Monograph:Instance": {
          'http://schema.org/name': {
            items: [
              {content: "Test", id: 1},
              {content: "Statement", id: 2}
            ]
          }
        }
      },
      {
        type: "REMOVE_ALL_CONTENT",
        payload:{
          uri: 'http://schema.org/name',
          reduxPath: ["resourceTemplate:Monograph:Instance", "http://schema.org/name"]
        }
      })
    ).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: []
        }
      }
    })
  })
})
