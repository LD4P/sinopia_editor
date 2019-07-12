// Copyright 2019 Stanford University see LICENSE for license

import {
  createReducer,
  setRetrieveError,
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
