import { removeAllContent, removeMyItem, setMyItems  } from '../../src/reducers/literal'

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
        rtId: "resourceTemplate:Monograph:Instance",
        uri: "http://schema.org/name",
        content: "test content"
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
          rtId: "resourceTemplate:Monograph:Instance",
          uri: 'http://schema.org/name'
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
