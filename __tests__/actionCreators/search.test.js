// Copyright 2019 Stanford University see LICENSE for license

import { fetchSinopiaSearchResults, fetchQASearchResults } from 'actionCreators/search'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaSearch'
import Swagger from 'swagger-client'

jest.mock('swagger-client')

describe('fetchSinopiaSearchResults', () => {
  const query = '*'
  const mockSearchResults = {
    totalHits: 1,
    results: {
      uri: 'http://sinopia.io/repository/stanford/123',
      label: 'A lonely title',
    },
  }

  it('dispatches actions', async () => {
    server.getSearchResults = jest.fn().mockResolvedValue(mockSearchResults)
    const dispatch = jest.fn()
    await fetchSinopiaSearchResults(query, 5, 10)(dispatch)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toBeCalledWith({
      type: 'SET_SEARCH_RESULTS',
      payload: {
        error: undefined,
        uri: 'sinopia',
        query: '*',
        searchResults: mockSearchResults.results,
        totalResults: mockSearchResults.totalHits,
        startOfRange: 5,
      },
    })
  })
})

describe('fetchQASearchResults', () => {
  const query = '*'
  const uri = 'urn:ld4p:qa:sharevde_stanford_ld4l_cache:all'
  it('dispatches action', async () => {
    const dispatch = jest.fn()
    const mockSearchResults = [
      {
        uri: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365',
        id: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365',
        label: 'These twain',
        context: [
          {
            property: 'Title',
            values: [
              ' These twain',
            ],
            selectable: true,
            drillable: false,
          },
          {
            property: 'Type',
            values: [
              'http://id.loc.gov/ontologies/bflc/Hub',
              'http://id.loc.gov/ontologies/bibframe/Work',
            ],
            selectable: false,
            drillable: false,
          },
          {
            property: 'Contributor',
            values: [
              'Bennett, Arnold,1867-1931.',
            ],
            selectable: false,
            drillable: false,
          },
        ],
      },
      {
        uri: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365-1',
        id: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365-1',
        label: 'These twain',
        context: [
          {
            property: 'Title',
            values: [
              ' These twain',
            ],
            selectable: true,
            drillable: false,
          },
          {
            property: 'Type',
            values: [
              'http://id.loc.gov/ontologies/bibframe/Text',
              'http://id.loc.gov/ontologies/bibframe/Work',
            ],
            selectable: false,
            drillable: false,
          },
          {
            property: 'Contributor',
            values: [
              'Bennett, Arnold,1867-1931.',
            ],
            selectable: false,
            drillable: false,
          },
        ],
      }]
    const mockActionFunction = jest.fn().mockResolvedValue({ body: mockSearchResults })
    const client = { apis: { SearchQuery: { GET_searchAuthority: mockActionFunction } } }
    Swagger.mockResolvedValue(client)

    await fetchQASearchResults(query, uri)(dispatch)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toBeCalledWith({
      type: 'SET_SEARCH_RESULTS',
      payload: {
        uri,
        query,
        searchResults: mockSearchResults,
        totalResults: 2,
        startOfRange: 0,
      },
    })
  })

  it('dispatches action when error', async () => {
    const dispatch = jest.fn()
    const mockActionFunction = jest.fn().mockRejectedValue(new Error('Ooops...'))
    const client = { apis: { SearchQuery: { GET_searchAuthority: mockActionFunction } } }
    Swagger.mockResolvedValue(client)

    await fetchQASearchResults(query, uri)(dispatch)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toBeCalledWith({
      type: 'SET_SEARCH_RESULTS',
      payload: {
        uri,
        query,
        searchResults: [],
        totalResults: 0,
        startOfRange: 0,
        error: { message: 'Ooops...' },
      },
    })
  })
})
