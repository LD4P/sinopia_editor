// Copyright 2018 Stanford University see LICENSE for license

import {
  removeAllContent, removeMyItem, setMyItems, setMySelections, setBaseURL, displayValidations,
} from '../../src/reducers/inputs'

import {
  findNode,
} from '../../src/reducers/index'

let initialState

beforeEach(() => {
  initialState = {
    resource: { },
  }
})

describe('setMyItems', () => {
  it('adds item to state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': { items: [] },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setMyItems(initialState, {
      type: 'SET_ITEMS',
      payload: {
        rtId: 'resourceTemplate:Monograph:Instance',
        uri: 'http://schema.org/name',
        reduxPath,
        items: [{ id: 0, content: 'Run the tests' }],
      },
    })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 0, content: 'Run the tests' }],
    })
  })

  it('adds item to an empty state', () => {
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setMyItems(initialState,
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://schema.org/name',
          reduxPath,
          items: [{ id: 0, content: 'Run the tests' }],
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 0, content: 'Run the tests' }],
    })
  })

  it('appends item to populated state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Book': {},
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/description']
    const result = setMyItems(initialState,
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://schema.org/description',
          reduxPath,
          items: [{ id: 2, content: 'add this!' }],
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 2, content: 'add this!' }],
    })
  })

  it('creates intermediate objects in the Redux state if present in reduxPath', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        abcdeCode: {
          'http://schema.org/name': 'A fun name',
        },
      },
    }
    const reduxPath = [
      'resource',
      'resourceTemplate:Monograph:Instance',
      'abcdeCode',
      'http://schema.org/Person',
      'http://schema.org/givenName',
    ]
    const result = setMyItems(initialState,
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://schema.org/description',
          reduxPath,
          items: [{ id: 2, content: 'Melissa' }],
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 2, content: 'Melissa' }],
    })
    expect(findNode(result, ['resource', 'resourceTemplate:Monograph:Instance', 'abcdeCode', 'http://schema.org/name'])).toEqual(
      'A fun name',
    )
  })

  it('adds new item to state when state has existing selector for another literal', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: [{ id: 1, content: 'Run the tests' }],
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name'],
        },
        'http://schema.org/description': {
          items: [],
          reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/description'],
        },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/description']
    const result = setMyItems(initialState,
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://schema.org/description',
          reduxPath,
          items: [{ id: 2, content: 'add this!' }],
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 2, content: 'add this!' }],
      reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/description'],
    })

    expect(findNode(result, ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name'])).toEqual({
      items: [{ id: 1, content: 'Run the tests' }],
      reduxPath: ['resourceTemplate:Monograph:Instance', 'http://schema.org/name'],
    })
  })
})

describe('setMySelections', () => {
  it('adds items to state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': { items: [] },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setMySelections(initialState, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'abc123',
        uri: 'http://schema.org/name',
        reduxPath,
        items: [{ id: 0, label: 'Run the tests', uri: 'http://schema.org/abc' }],
      },
    })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 0, label: 'Run the tests', uri: 'http://schema.org/abc' }],
    })
  })

  it('overwrites items in  current state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': { items: [{ id: 0, label: 'Run the tests', uri: 'http://schema.org/abc' }] },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setMySelections(initialState, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'def456',
        uri: 'http://schema.org/name',
        reduxPath,
        items: [
          { id: 0, label: 'Run the tests', uri: 'http://schema.org/abc' },
          { id: 1, label: 'See if they pass', uri: 'http://schema.org/def' },
        ],
      },
    })

    expect(findNode(result, reduxPath)).toEqual({
      items: [
        { id: 0, label: 'Run the tests', uri: 'http://schema.org/abc' },
        { id: 1, label: 'See if they pass', uri: 'http://schema.org/def' },
      ],
    })
  })

  it('removes all items in  current state by overwriting with an empty object', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: [
            { id: 0, label: 'Run the tests', uri: 'http://schema.org/abc' },
            { id: 1, label: 'See if they pass', uri: 'http://schema.org/def' },
          ],
        },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setMySelections(initialState, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'nomatter',
        uri: 'http://not/importanr',
        reduxPath,
        items: [],
      },
    })

    expect(findNode(result, reduxPath)).toEqual({ items: [] })
  })
})

describe('setBaseURL', () => {
  it('sets the base URL', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: [{ id: 1, content: 'more content' }],
        },
      },
    }

    const result = setBaseURL(initialState, {
      type: 'SET_BASE_URL',
      payload: 'http://example.com/foo/123',
    })
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'resourceURI']

    expect(findNode(result, reduxPath)).toEqual('http://example.com/foo/123')
  })
})

describe('removeMyItem', () => {
  it('removes an item from state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: [
            { content: 'test content', id: 0 },
            { content: 'more content', id: 1 },
          ],
        },
      },
    }
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = removeMyItem(initialState,
      {
        type: 'REMOVE_ITEM',
        payload: {
          id: 0,
          rtId: 'resourceTemplate:Monograph:Instance',
          reduxPath,
          uri: 'http://schema.org/name',
          content: 'test content',
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 1, content: 'more content' }],
    })
  })

  it('with non-existent id does not change state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: [
            { content: 'Test', id: 1 },
            { content: 'Statement', id: 2 },
          ],
        },
      },
    }
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = removeMyItem(initialState,
      {
        type: 'REMOVE_ITEM',
        payload: {
          id: 0,
          uri: 'http://schema.org/name',
          content: 'test content',
          reduxPath,
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: [
        { content: 'Test', id: 1 },
        { content: 'Statement', id: 2 },
      ],
    })
  })
})

describe('removeAllContent', () => {
  it('handles REMOVE_ALL_CONTENT', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: [
            { content: 'Test', id: 1 },
            { content: 'Statement', id: 2 },
          ],
        },
      },
    }
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = removeAllContent(initialState, {
      type: 'REMOVE_ALL_CONTENT',
      payload: {
        uri: 'http://schema.org/name',
        reduxPath,
      },
    })

    expect(findNode(result, reduxPath)).toEqual({
      items: [],
    })
  })
})

describe('displayValidations', () => {
  it('handles DISPLAY_VALIDATIONS', () => {
    const result = displayValidations(initialState,
      {
        type: 'DISPLAY_VALIDATIONS',
        payload: true,
      })

    expect(findNode(result, ['resource', 'editor', 'displayValidations'])).toBeTruthy()
  })
})
