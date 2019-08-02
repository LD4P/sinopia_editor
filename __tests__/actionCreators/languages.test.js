// Copyright 2019 Stanford University see LICENSE for license

import loadLanguages from 'actionCreators/languages'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const mockStore = configureMockStore([thunk])

describe('loadLanguages', () => {
  const mockSuccessResponse = { languages: [{ label: 'French' }] }
  const mockJsonPromise = Promise.resolve(mockSuccessResponse)
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  })

  const state = {
    selectorReducer: {
      entities: {
        languages: {
          options: [],
        },
      },
    },
  }
  const store = mockStore(state)

  global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)

  it('dispatches actions', async () => {
    await store.dispatch(loadLanguages())
    const actions = store.getActions()
    expect(actions.length).toEqual(2)
    expect(actions[0]).toEqual({ type: 'LOADING_LANGUAGES' })
    expect(actions[1]).toEqual({ type: 'LANGUAGES_RECEIVED', payload: mockSuccessResponse })
  })
})
