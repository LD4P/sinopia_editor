// Copyright 2019 Stanford University see LICENSE for license

import {
  createReducer, setRetrieveError, removeResource,
  clearResourceTemplates,
} from 'reducers/index'

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

describe('setRetrieveError', () => {
  it('adds error to editor state', () => {
    const newState = setRetrieveError(initialState.selectorReducer, {
      type: 'RETRIEVE_ERROR',
      payload: { resourceTemplateId: 'abc123' },
    })

    expect(newState.editor.serverError).toEqual('There was a problem retrieving abc123.')
  })
  it('adds error with reason to editor state', () => {
    const newState = setRetrieveError(initialState.selectorReducer, {
      type: 'RETRIEVE_ERROR',
      payload: { resourceTemplateId: 'abc123', reason: 'Because it is broken.' },
    })

    expect(newState.editor.serverError).toEqual('There was a problem retrieving abc123: Because it is broken.')
  })
})

describe('removeResource', () => {
  it('removes resource', () => {
    const handlers = { REMOVE_RESOURCE: removeResource }
    const oldState = {
      resource: {
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
      },
    }

    const action = {
      type: 'REMOVE_RESOURCE',
      payload: [
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/instanceOf',
        '4EzqN4DUw',
        'resourceTemplate:bf2:Monograph:Work',
      ],
    }

    const reducer = createReducer(handlers)
    const newState = reducer(oldState, action)
    expect(newState).toEqual({
      resource: {
        'resourceTemplate:bf2:Monograph:Instance': {
          'http://id.loc.gov/ontologies/bibframe/instanceOf': {
            omHNLGWY71J: {
              'resourceTemplate:bf2:Monograph:Work': {},
            },
          },
        },
      },
    })
  })
})

describe('clearResourceTemplates', () => {
  it('removes all resource templates', () => {
    const handlers = { CLEAR_RESOURCE_TEMPLATES: clearResourceTemplates }
    const oldState = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Instance': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          },
        },
      },
    }

    const action = {
      type: 'CLEAR_RESOURCE_TEMPLATES',
    }

    const reducer = createReducer(handlers)
    const newState = reducer(oldState, action)
    expect(newState).toEqual({
      entities: {
        resourceTemplates: {},
      },
    })
  })
})
