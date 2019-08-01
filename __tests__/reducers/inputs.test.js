// Copyright 2019 Stanford University see LICENSE for license

import {
  removeMyItem, setItemsOrSelections, setBaseURL,
  validate, showGroupChooser, closeGroupChooser, showRdfPreview,
  showResourceURIMessage, clearResourceURIMessage,
} from 'reducers/inputs'
import {
  findNode,
} from 'selectors/resourceSelectors'
import Validator from 'ResourceValidator'

let initialState

jest.mock('ResourceValidator')

beforeAll(() => {
  Validator.mockImplementation(() => {
    return {
      validate: () => {
        return [{}, []]
      },
    }
  })
})

beforeEach(() => {
  initialState = {
    editor: {
      errors: [],
      displayValidations: false,
      groupChoice: {
        show: false,
      },
      resourceURIMessage: {
        show: false,
      },
      rdfPreview: {
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
  describe('when the state is valid', () => {
    it('the groupChoice.show to true', () => {
      const result = showGroupChooser(initialState)

      expect(result.editor.groupChoice.show).toBe(true)
      expect(result.editor.displayValidations).toBe(false)
    })
  })

  describe('when the state is invalid', () => {
    it('sets displayValidations to true', () => {
      Validator.mockImplementationOnce(() => {
        return {
          validate: () => {
            return [{}, ['error']]
          },
        }
      })
      const result = showGroupChooser(initialState)

      expect(result.editor.displayValidations).toBe(true)
      expect(result.editor.groupChoice.show).toBe(false)
      expect(result.editor.rdfPreview.show).toBe(false)
    })
  })
})


describe('closeGroupChooser()', () => {
  it('sets the groupChoice.show to false', () => {
    initialState.editor.groupChoice.show = true
    const result = closeGroupChooser(initialState)

    expect(result.editor.groupChoice.show).toBe(false)
  })
})

describe('showRdfPreview()', () => {
  it('sets the showRdfPreview to true', () => {
    const result = showRdfPreview(initialState, { payload: true })

    expect(result.editor.rdfPreview.show).toBe(true)
  })

  it('sets the showRdfPreview to false', () => {
    const result = showRdfPreview(initialState, { payload: false })

    expect(result.editor.rdfPreview.show).toBe(false)
  })
})

describe('setItemsOrSelections with action type: ITEMS_SELECTED', () => {
  it('adds item to state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': { items: {} },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setItemsOrSelections(initialState, {
      type: 'ITEMS_SELECTED',
      payload: {
        rtId: 'resourceTemplate:Monograph:Instance',
        uri: 'http://schema.org/name',
        reduxPath,
        items: {
          abc1233: {
            content: 'Run the tests',
          },
        },
      },
    })

    expect(findNode(result, reduxPath)).toEqual({
      items: {
        abc1233: {
          content: 'Run the tests',
        },
      },
    })
  })

  it('adds item to an empty state', () => {
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setItemsOrSelections(initialState,
      {
        type: 'ITEMS_SELECTED',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://schema.org/name',
          reduxPath,
          items: {
            abc1233: {
              content: 'Run the tests',
            },
          },
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: {
        abc1233: {
          content: 'Run the tests',
        },
      },
    })
  })

  it('appends item to populated state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Book': {},
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/description']
    const result = setItemsOrSelections(initialState,
      {
        type: 'ITEMS_SELECTED',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://schema.org/description',
          reduxPath,
          items: {
            abc123: { content: 'add this!' },
          },
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: {
        abc123: { content: 'add this!' },
      },
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
    const result = setItemsOrSelections(initialState,
      {
        type: 'ITEMS_SELECTED',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
          reduxPath,
          items: {
            ghwixOwWI: { content: 'Melissa' },
          },
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: {
        ghwixOwWI: { content: 'Melissa' },
      },
    })
  })

  it('adds new item to state when state has existing selector for another literal', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: {
            abc123: { content: 'Run the tests' },
            def234: { content: 'Keep this' },
          },
        },
        'http://schema.org/description': {
          items: {
            ghi567: { content: 'Keep this' },
          },
        },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/description']
    const result = setItemsOrSelections(initialState,
      {
        type: 'ITEMS_SELECTED',
        payload: {
          rtId: 'resourceTemplate:Monograph:Instance',
          uri: 'http://schema.org/description',
          reduxPath,
          items: {
            cde987: { content: 'add this!' },
          },
        },
      })

    expect(findNode(result, reduxPath)).toEqual({
      items: {
        cde987: { content: 'add this!' },
        ghi567: { content: 'Keep this' },
      },
    })

    expect(findNode(result, ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name'])).toEqual({
      items: {
        abc123: { content: 'Run the tests' },
        def234: { content: 'Keep this' },
      },
    })
  })
})

describe('setItemsOrSelections with action type: CHANGE_SELECTIONS', () => {
  it('adds items to state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': { items: {} },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setItemsOrSelections(initialState, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'abc123',
        uri: 'http://schema.org/name',
        reduxPath,
        items: {
          def123: { label: 'Run the tests', uri: 'http://schema.org/abc' },
        },
      },
    })

    expect(findNode(result, reduxPath)).toEqual({
      items: {
        def123: { label: 'Run the tests', uri: 'http://schema.org/abc' },
      },
    })
  })

  it('overwrites items in  current state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: {
            cde678: { label: 'Run the tests', uri: 'http://schema.org/abc' },
          },
        },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setItemsOrSelections(initialState, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'def456',
        uri: 'http://schema.org/name',
        reduxPath,
        items: {
          cde678: { label: 'Run the tests', uri: 'http://schema.org/abc' },
          fgh999: { label: 'See if they pass', uri: 'http://schema.org/def' },
        },
      },
    })

    expect(findNode(result, reduxPath)).toEqual({
      items: {
        cde678: { label: 'Run the tests', uri: 'http://schema.org/abc' },
        fgh999: { label: 'See if they pass', uri: 'http://schema.org/def' },
      },
    })
  })

  it('removes all items in  current state by overwriting with an empty object', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: {
            abc123: { label: 'Run the tests', uri: 'http://schema.org/abc' },
            def456: { label: 'See if they pass', uri: 'http://schema.org/def' },
          },
        },
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name']
    const result = setItemsOrSelections(initialState, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        id: 'nomatter',
        uri: 'http://not.important',
        reduxPath,
        items: {},
      },
    })

    expect(findNode(result, reduxPath)).toEqual({ items: {} })
  })

  it('adds an empty object for a key if the key does not contain an object by default', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {},
      },
    }

    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name', 'QBzX5hqphW', 'test:RT:SomethingElse', 'http://not.important']
    const result = setItemsOrSelections(initialState, {
      type: 'CHANGE_SELECTIONS',
      payload: {
        uri: 'http://not.important/now',
        items: {
          abc123: {
            label: 'Something looked up',
            uri: 'http://lookup.source/1',
          },
        },
        reduxPath,
      },
    })

    expect(findNode(result, reduxPath)).toEqual({ items: { abc123: { label: 'Something looked up', uri: 'http://lookup.source/1' } } })
  })
})

describe('setBaseURL', () => {
  it('sets the base URL', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: {
            abc123: {
              content: 'more content',
            },
          },
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

describe('showResourceURIMessage', () => {
  it('displays the Resource URI', () => {
    initialState.editor.resourceURIMessage = {
      show: false,
      uri: '',
    }

    const result = showResourceURIMessage(initialState, {
      type: 'SHOW_RESOURCE_URI_MESSAGE',
      payload: 'http://example.com/foo/123',
    })

    expect(result.editor.resourceURIMessage.show).toBe(true)
    expect(result.editor.resourceURIMessage.uri).toEqual('http://example.com/foo/123')
  })
})

describe('clearResourceURIMessage', () => {
  it('turns off the Resource URI message display', () => {
    initialState.editor.resourceURIMessage = {
      show: true,
      uri: 'this message will disapear',
    }

    const result = clearResourceURIMessage(initialState, {
      type: 'CLEAR_RESOURCE_URI_MESSAGE',
    })

    expect(result.editor.resourceURIMessage.show).toBe(false)
    expect(result.editor.resourceURIMessage.uri).toEqual('')
  })
})

describe('removeMyItem', () => {
  it('removes an item from state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: {
            abc123: { content: 'test content' },
            def456: { content: 'more content' },
          },
        },
      },
    }
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name', 'items', 'abc123']
    const result = removeMyItem(initialState,
      {
        type: 'REMOVE_ITEM',
        payload: reduxPath,
      })

    expect(findNode(result, reduxPath.slice(0, -2))).toEqual({
      items: {
        def456: { content: 'more content' },
      },
    })
  })

  it('with non-existent id does not change state', () => {
    initialState.resource = {
      'resourceTemplate:Monograph:Instance': {
        'http://schema.org/name': {
          items: {
            abc123: { content: 'Test' },
            def456: { content: 'Statement' },
          },
        },
      },
    }
    const reduxPath = ['resource', 'resourceTemplate:Monograph:Instance', 'http://schema.org/name', 'items', '0']
    const result = removeMyItem(initialState,
      {
        type: 'REMOVE_ITEM',
        payload: reduxPath,
      })

    expect(findNode(result, reduxPath.slice(0, -2))).toEqual({
      items: {
        abc123: { content: 'Test' },
        def456: { content: 'Statement' },
      },
    })
  })
})

describe('validate', () => {
  it('returns a new state', () => {
    const result = validate(initialState)
    expect(findNode(result, ['resource', 'editor', 'displayValidations'])).toBeTruthy()
  })
})
