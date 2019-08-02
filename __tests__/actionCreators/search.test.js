// Copyright 2019 Stanford University see LICENSE for license

import fetchSearchResults from 'actionCreators/search'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaServer'

describe('fetchSearchResults', () => {
  const query = '*'
  const mockSearchResults = {
    totalHits: 1,
    results: {
      uri: 'http://sinopia.io/repository/stanford/123',
      title: 'A lonely title',
    },
  }

  it('dispatches actions', async () => {
    server.getSearchResults = jest.fn().mockResolvedValue(mockSearchResults)
    const dispatch = jest.fn()
    await fetchSearchResults(query)(dispatch)
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toBeCalledWith({ type: 'GET_SEARCH_RESULTS_STARTED', payload: { query: '*', queryFrom: undefined } })
    expect(dispatch).toBeCalledWith({ type: 'SET_SEARCH_RESULTS', payload: { query: '*', searchResults: mockSearchResults.results, totalResults: mockSearchResults.totalHits } })
  })
})
