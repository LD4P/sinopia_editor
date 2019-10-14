// Copyright 2019 Stanford University see LICENSE for license

import appReducer, {
  createReducer, removeResource, saveResourceFinished,
  setLastSaveChecksum,
} from 'reducers/index'
import _ from 'lodash'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'

let initialState

beforeEach(() => {
  initialState = {
    selectorReducer: {
      entities: {
        // The stuff we've retrieved from the server
        resourceTemplates: { },
      },
      resource: { // The state we're displaying in the editor
      },
      editor: {
      },
    },
  }
})

describe('createReducer', () => {
  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('handles the initial state', () => {
    const reducer = createReducer({})
    const action = {}
    expect(reducer(initialState, action)).toMatchObject(
      {
        selectorReducer: {
          entities: {
            resourceTemplates: {},
          },
          resource: {},
        },
      },
    )
  })

  it('handles SET_BASE_URL', () => {
    const setBaseURL = jest.fn().mockReturnValue({})
    const handlers = { SET_BASE_URL: setBaseURL }
    const oldState = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Instance': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          },
        },
      },
      resource: {
        'resourceTemplate:bf2:Monograph:Instance': {
        },
      },
    }

    const action = {
      type: 'SET_BASE_URL',
      payload: 'http://example.com/base/123',
    }
    const reducer = createReducer(handlers)
    reducer(oldState, action)
    expect(setBaseURL).toBeCalledWith(oldState, action)
  })
})

describe('clearRetrieveResourceError', () => {
  it('clears the error', () => {
    const newInitialState = { ...initialState }
    newInitialState.selectorReducer.editor.retrieveResourceError = 'Ooops'

    const newState = appReducer(newInitialState, {
      type: 'CLEAR_RETRIEVE_RESOURCE_ERROR',
    })

    expect(newState.selectorReducer.editor.retrieveResourceError).toBeUndefined()
  })
})

describe('clearRetrieveResourceTemplateError', () => {
  it('clears the error', () => {
    const newInitialState = { ...initialState }
    newInitialState.selectorReducer.editor.retrieveResourceTemplateError = 'Ooops'

    const newState = appReducer(newInitialState, {
      type: 'CLEAR_RETRIEVE_RESOURCE_TEMPLATE_ERROR',
    })

    expect(newState.selectorReducer.editor.retrieveResourceTemplateError).toBeUndefined()
  })
})

describe('clearSaveResourceError', () => {
  it('clears the error', () => {
    const newInitialState = { ...initialState }
    newInitialState.selectorReducer.editor.saveResourceError = 'Ooops'

    const newState = appReducer(newInitialState, {
      type: 'CLEAR_SAVE_RESOURCE_ERROR',
    })

    expect(newState.selectorReducer.editor.saveResourceError).toBeUndefined()
  })
})

describe('clearSaveResourceTemplateError', () => {
  it('clears the error', () => {
    const newInitialState = { ...initialState }
    newInitialState.selectorReducer.editor.saveResourceTemplateError = 'Ooops'

    const newState = appReducer(newInitialState, {
      type: 'CLEAR_SAVE_RESOURCE_TEMPLATE_ERROR',
    })

    expect(newState.selectorReducer.editor.saveResourceTemplateError).toBeUndefined()
  })
})

describe('setRetrieveResourceError', () => {
  it('adds error with uri to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'RETRIEVE_RESOURCE_ERROR',
      payload: {
        uri: 'http://abc123',
      },
    })
    expect(newState.selectorReducer.editor.retrieveResourceError).toEqual('There was a problem retrieving http://abc123.')
  })
  it('adds error with uri and reason to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'RETRIEVE_RESOURCE_ERROR',
      payload: {
        uri: 'http://abc123',
        reason: 'Ooops',
      },
    })
    expect(newState.selectorReducer.editor.retrieveResourceError).toEqual('There was a problem retrieving http://abc123: Ooops')
  })
})

describe('setRetrieveResourceTemplateError', () => {
  it('adds error with resourceTemplateId to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'RETRIEVE_RESOURCE_TEMPLATE_ERROR',
      payload: {
        resourceTemplateId: 'bf2:WorkTitle',
      },
    })
    expect(newState.selectorReducer.editor.retrieveResourceTemplateError).toEqual('There was a problem retrieving bf2:WorkTitle.')
  })
  it('adds error with resourceTemplateId and reason to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'RETRIEVE_RESOURCE_TEMPLATE_ERROR',
      payload: {
        resourceTemplateId: 'bf2:WorkTitle',
        reason: 'Ooops',
      },
    })
    expect(newState.selectorReducer.editor.retrieveResourceTemplateError).toEqual('There was a problem retrieving bf2:WorkTitle: Ooops')
  })
})

describe('setSaveResourceError', () => {
  it('adds error with reason to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'SAVE_RESOURCE_ERROR',
      payload: {
        uri: null,
        reason: 'publishing error msg',
      },
    })
    expect(newState.selectorReducer.editor.saveResourceError).toEqual('There was a problem saving: publishing error msg')
  })

  it('adds error with reason and uri to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'SAVE_RESOURCE_ERROR',
      payload: {
        uri: 'http://abc123',
        reason: 'publishing error msg',
      },
    })

    expect(newState.selectorReducer.editor.saveResourceError).toEqual('There was a problem saving http://abc123: publishing error msg')
  })
})

describe('setSaveResourceTemplateError', () => {
  it('adds error with resourceTemplateId to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'SAVE_RESOURCE_TEMPLATE_ERROR',
      payload: {
        resourceTemplateId: 'bf2:WorkTitle',
      },
    })
    expect(newState.selectorReducer.editor.saveResourceTemplateError).toEqual('There was a problem saving bf2:WorkTitle.')
  })

  it('adds error with reason and resourceTemplateId to editor state', () => {
    const newState = appReducer(initialState, {
      type: 'SAVE_RESOURCE_TEMPLATE_ERROR',
      payload: {
        resourceTemplateId: 'bf2:WorkTitle',
        reason: 'publishing error msg',
      },
    })

    expect(newState.selectorReducer.editor.saveResourceTemplateError).toEqual('There was a problem saving bf2:WorkTitle: publishing error msg')
  })
})

describe('removeResource', () => {
  it('removes resource', async () => {
    const handlers = { REMOVE_RESOURCE: removeResource }
    initialState.selectorReducer.entities.resourceTemplates = {
      'resourceTemplate:bf2:Monograph:Instance': (await getFixtureResourceTemplate('resourceTemplate:bf2:Monograph:Instance')).response.body,
      'resourceTemplate:bf2:Monograph:Work': (await getFixtureResourceTemplate('resourceTemplate:bf2:Monograph:Work')).response.body,
    }
    initialState.selectorReducer.resource = {
      'resourceTemplate:bf2:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/instanceOf': {
          omHNLGWY71J: {
            'resourceTemplate:bf2:Monograph:Work': {},
          },
          '4EzqN4DUw': {
            'resourceTemplate:bf2:Monograph:Work': {
              'http://id.loc.gov/ontologies/bibframe/title': {
                '81VUyIsMs': {
                  'resourceTemplate:bf2:WorkTitle': {
                    'http://id.loc.gov/ontologies/bibframe/mainTitle': {
                      items: [
                        {
                          content: 'foo',
                          id: 'YfsGCV2DF',
                          lang: {
                            items: [
                              {
                                id: 'en',
                                label: 'English',
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
                h7rh5LW30M: {
                  'resourceTemplate:bf2:WorkVariantTitle': {},
                },
                '4vCZiwJzSG': {
                  'resourceTemplate:bflc:TranscribedTitle': {},
                },
              },
            },
          },
        },
      },
    }

    const action = {
      type: 'REMOVE_RESOURCE',
      payload: [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/instanceOf',
        '4EzqN4DUw',
      ],
    }

    const reducer = createReducer(handlers)
    const newState = reducer(initialState.selectorReducer, action)
    expect(newState.resource).toEqual({
      'resourceTemplate:bf2:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/instanceOf': {
          omHNLGWY71J: {
            'resourceTemplate:bf2:Monograph:Work': {},
          },
        },
      },
    })
    // Validation performed
    expect(newState.editor.errors).toBeTruthy()
    expect(newState.editor.resourceValidationErrors).toBeTruthy()
  })
})

describe('saveResourceFinished', () => {
  const action = { payload: 'abc123' }
  it('sets last save differently each time called', () => {
    expect(initialState.selectorReducer.editor.lastSave).toBeFalsy()
    const newState = saveResourceFinished(initialState.selectorReducer, action)
    expect(newState.editor.lastSave).toBeTruthy()

    const now = Date.now()
    while (now === Date.now()) {
      // Wait
    }

    const newState2 = saveResourceFinished(_.cloneDeep(newState), action)
    expect(newState.editor.lastSave).not.toEqual(newState2.editor.lastSave)
  })
  it('sets lastSaveChecksum', () => {
    const newState = saveResourceFinished(initialState.selectorReducer, action)
    expect(newState.editor.lastSaveChecksum).toEqual('abc123')
  })
})

describe('setLastSaveChecksum', () => {
  const action = { payload: 'abc123' }

  it('sets lastSaveChecksum', () => {
    const newState = setLastSaveChecksum(initialState.selectorReducer, action)
    expect(newState.editor.lastSaveChecksum).toEqual('abc123')
  })
})
