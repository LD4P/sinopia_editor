import { removeAllContent, removeMyItem, setMyItems  } from '../../src/reducers/literal'

describe('literal reducer', () => {

  it('should handle SET_ITEMS', () => {
    const literalSetItems = setMyItems({ "resourceTemplate:Monograph:Instance": {
      'http://schema.org/name': { items: [] }
    }}, {
      type: 'SET_ITEMS',
      payload: {
        rtId: 'resourceTemplate:Monograph:Instance',
        uri:'http://schema.org/name',
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

    expect(
      setMyItems({ "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [{ id: 1, content: "Run the tests" }] },
        'http://schema.org/description': {
          items: []}
        }
      },
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: "resourceTemplate:Monograph:Instance",
          uri: 'http://schema.org/description',
          items: [ { id: 2, content: "add this!"}]
        }
      })
    ).toEqual({
      "resourceTemplate:Monograph:Instance": {
        'http://schema.org/name': {
          items: [{ id: 1, content: 'Run the tests'}]
        },
        'http://schema.org/description': {
          items: [{ id: 2, content: "add this!"}]
        }
      }
    })
  })
  it('should handle REMOVE_ITEM', () => {
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
