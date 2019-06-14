// Copyright 2019 Stanford University see LICENSE for license

import {
  removeAllContent, removeMyItem, setMyItems, setMySelections, setBaseURL,
  validate, showGroupChooser,
} from 'reducers/inputs'

import {
  findNode,
} from 'reducers/index'

let initialState

beforeEach(() => {
  initialState = {
    editor: {
      errors: [],
      displayValidations: false,
      groupChoice: {
        show: false,
      },
    },
    resource: { },
    entities: {
      resourceTemplates: {
        'resourceTemplate:Monograph:Instance': {
          propertyTemplates: [
            { propertyURI: 'http://schema.org/name' },
            { propertyURI: 'http://schema.org/description' },
            { propertyURI: 'http://id.loc.gov/ontologies/bibframe/title' },
          ],
        },
      },
    },
  }
})

describe('showGroupChooser()', () => {
  it('sets the showGroupChooser to true', () => {
    const result = showGroupChooser(initialState, { payload: true })

    expect(result.editor.groupChoice.show).toBe(true)
  })

  it('sets the showGroupChooser to false', () => {
    const result = showGroupChooser(initialState, { payload: false })

    expect(result.editor.groupChoice.show).toBe(false)
  })
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
        'http://id.loc.gov/ontologies/bibframe/title': {
        },
      },
    }

    const reduxPath = [
      'resource',
      'resourceTemplate:Monograph:Instance',
      'http://id.loc.gov/ontologies/bibframe/title',
      'YsqS99TfpPsn',
      'resourceTemplate:bf2:Title',
      'http://id.loc.gov/ontologies/bibframe/mainTitle',
    ]
    const result = setMyItems(initialState,
      {
        type: 'SET_ITEMS',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
          reduxPath,
          items: [{ id: 'ghwixOwWI', content: 'Melissa' }],
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: [{ id: 'ghwixOwWI', content: 'Melissa' }],
    })
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

describe('validate', () => {
  it('handles VALIDATE', () => {
    const result = validate(initialState,
      {
        type: 'VALIDATE',
        payload: {
          show: true,
        },
      })

    expect(findNode(result, ['resource', 'editor', 'displayValidations'])).toBeTruthy()
  })
})
