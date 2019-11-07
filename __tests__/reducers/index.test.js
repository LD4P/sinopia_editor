// Copyright 2019 Stanford University see LICENSE for license

import appReducer, {
  createReducer, removeResource, saveResourceFinished,
  setLastSaveChecksum,
} from 'reducers/index'
import _ from 'lodash'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
import { createBlankState } from 'testUtils'
import Validator from 'ResourceValidator'

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

describe('createReducer', () => {
  // Make sure spies/mocks don't leak between tests
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('handles the initial state', () => {
    const reducer = createReducer({})
    const action = {}
    expect(reducer(createBlankState(), action)).toMatchObject(
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

describe('clearErrors', () => {
  it('clears the error when already exists', () => {
    const state = createBlankState()
    state.selectorReducer.editor.errors.testerrorkey = ['Ooops']

    const newState = appReducer(state, {
      type: 'CLEAR_ERRORS',
      payload: 'testerrorkey',
    })

    expect(newState.selectorReducer.editor.errors.testerrorkey).toEqual([])
  })
  it('clears the error when does not already exists', () => {
    const newState = appReducer(createBlankState(), {
      type: 'CLEAR_ERRORS',
      payload: 'testerrorkey',
    })

    expect(newState.selectorReducer.editor.errors.testerrorkey).toEqual([])
  })
})

describe('appendError', () => {
  it('adds error when error key does not exist', () => {
    const newState = appReducer(createBlankState(), {
      type: 'APPEND_ERROR',
      payload: {
        errorKey: 'testerrorkey',
        error: 'Error: test',
      },
    })
    expect(newState.selectorReducer.editor.errors.testerrorkey).toEqual(['Error: test'])
  })
  it('adds error when error key already exists', () => {
    const state = createBlankState()
    state.selectorReducer.editor.errors.testerrorkey = ['Error: existing']
    const newState = appReducer(state, {
      type: 'APPEND_ERROR',
      payload: {
        errorKey: 'testerrorkey',
        error: 'Error: test',
      },
    })
    expect(newState.selectorReducer.editor.errors.testerrorkey).toEqual(['Error: existing', 'Error: test'])
  })
})

describe('removeResource', () => {
  it('removes resource', async () => {
    const handlers = { REMOVE_RESOURCE: removeResource }
    const state = createBlankState()
    state.selectorReducer.entities.resourceTemplates = {
      'resourceTemplate:bf2:Monograph:Instance': (await getFixtureResourceTemplate('resourceTemplate:bf2:Monograph:Instance')).response.body,
      'resourceTemplate:bf2:Monograph:Work': (await getFixtureResourceTemplate('resourceTemplate:bf2:Monograph:Work')).response.body,
    }
    state.selectorReducer.resource = {
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
    const newState = reducer(state.selectorReducer, action)
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
    expect(newState.editor.resourceValidation.errors).toBeTruthy()
    expect(newState.editor.resourceValidation.errorsByPath).toBeTruthy()
  })
})

describe('saveResourceFinished', () => {
  const action = { payload: 'abc123' }
  it('sets last save differently each time called', () => {
    const state = createBlankState()
    expect(state.selectorReducer.editor.lastSave).toBeFalsy()
    const newState = saveResourceFinished(state.selectorReducer, action)
    expect(newState.editor.lastSave).toBeTruthy()

    const now = Date.now()
    while (now === Date.now()) {
      // Wait
    }

    const newState2 = saveResourceFinished(_.cloneDeep(newState), action)
    expect(newState.editor.lastSave).not.toEqual(newState2.editor.lastSave)
  })
  it('sets lastSaveChecksum', () => {
    const state = createBlankState()
    const newState = saveResourceFinished(state.selectorReducer, action)
    expect(newState.editor.lastSaveChecksum).toEqual('abc123')
  })
})

describe('setLastSaveChecksum', () => {
  const action = { payload: 'abc123' }

  it('sets lastSaveChecksum', () => {
    const state = createBlankState()
    const newState = setLastSaveChecksum(state.selectorReducer, action)
    expect(newState.editor.lastSaveChecksum).toEqual('abc123')
  })
})

describe('setResource', () => {
  it('updates state', () => {
    const state = createBlankState()
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Work:Instance'] = 'anotherrt'
    state.selectorReducer.editor.resourceValidation.show = true
    state.selectorReducer.editor.copyToNewMessage = { foo: 'bar' }

    const newState = appReducer(state, {
      type: 'RESOURCE_LOADED',
      payload: {
        resource: 'theresource',
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Instance': 'thert',
        },
      },
    })

    expect(newState.selectorReducer.resource).toEqual('theresource')
    expect(newState.selectorReducer.entities.resourceTemplates).toEqual({
      'resourceTemplate:bf2:Monograph:Instance': 'thert',
      'resourceTemplate:bf2:Work:Instance': 'anotherrt',
    })
    expect(newState.selectorReducer.editor.resourceValidation.show).toBe(false)
    expect(newState.selectorReducer.editor.copyToNewMessage).toEqual({})
  })
})

describe('updateProperty', () => {
  it('updates state', () => {
    const state = createBlankState()
    state.selectorReducer.resource = {
      'ld4p:RT:bf2:Monograph:Item': {
        'http://id.loc.gov/ontologies/bibframe/heldBy': {},
        'http://id.loc.gov/ontologies/bibframe/shelfMark': {},
      },
    }
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Work:Instance'] = 'anotherrt'
    const newState = appReducer(state, {
      type: 'UPDATE_PROPERTY',
      payload: {
        reduxPath: [
          'resource',
          'ld4p:RT:bf2:Monograph:Item',
          'http://id.loc.gov/ontologies/bibframe/heldBy',
        ],
        resourceFragment: {
          items: {},
        },
        resourceTemplates: {
          'ld4p:RT:bf2:Monograph:Item': 'thert',
        },
      },
    })

    expect(newState.selectorReducer.resource).toEqual({
      'ld4p:RT:bf2:Monograph:Item': {
        'http://id.loc.gov/ontologies/bibframe/heldBy': { items: {} },
        'http://id.loc.gov/ontologies/bibframe/shelfMark': {},
      },
    })
    expect(newState.selectorReducer.entities.resourceTemplates).toEqual({
      'ld4p:RT:bf2:Monograph:Item': 'thert',
      'resourceTemplate:bf2:Work:Instance': 'anotherrt',
    })
  })
})

describe('appendResource', () => {
  it('updates state', () => {
    const state = createBlankState()
    state.selectorReducer.resource = {
      'ld4p:RT:bf2:Monograph:Item': {
        'http://id.loc.gov/ontologies/bibframe/heldBy': {
          items: [],
        },
        'http://id.loc.gov/ontologies/bibframe/shelfMark': {
          Iq6z9BBm: {
            'ld4p:RT:bf2:Identifiers:LC': {
              'http://www.w3.org/2000/01/rdf-schema#label': {},
            },
          },
        },
      },
    }
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Work:Instance'] = 'anotherrt'
    const newState = appReducer(state, {
      type: 'APPEND_RESOURCE',
      payload: {
        reduxPath: [
          'resource',
          'ld4p:RT:bf2:Monograph:Item',
          'http://id.loc.gov/ontologies/bibframe/shelfMark',
          'P2MMJNNW',
          'ld4p:RT:bf2:Identifiers:LC',
        ],
        resource: {
          P2MMJNNW: {
            'ld4p:RT:bf2:Identifiers:LC': { 'http://www.w3.org/2000/01/rdf-schema#label': {} },
          },
        },
        resourceTemplates: {
          'ld4p:RT:bf2:Monograph:Item': 'thert',
          'ld4p:RT:bf2:Identifiers:LC': 'the2ndrt',
        },
      },
    })

    expect(newState.selectorReducer.resource).toEqual({
      'ld4p:RT:bf2:Monograph:Item': {
        'http://id.loc.gov/ontologies/bibframe/heldBy': {
          items: [],
        },
        'http://id.loc.gov/ontologies/bibframe/shelfMark': {
          Iq6z9BBm: {
            'ld4p:RT:bf2:Identifiers:LC': {
              'http://www.w3.org/2000/01/rdf-schema#label': {},
            },
          },
          P2MMJNNW: {
            'ld4p:RT:bf2:Identifiers:LC': {
              'http://www.w3.org/2000/01/rdf-schema#label': {},
            },
          },

        },
      },
    })
    expect(newState.selectorReducer.entities.resourceTemplates).toEqual({
      'ld4p:RT:bf2:Monograph:Item': 'thert',
      'ld4p:RT:bf2:Identifiers:LC': 'the2ndrt',
      'resourceTemplate:bf2:Work:Instance': 'anotherrt',
    })
  })
})
