// Copyright 2019 Stanford University see LICENSE for license
import { fetchSinopiaSearchResults, fetchQASearchResults } from 'actionCreators/search'
import * as server from 'sinopiaSearch'
import Swagger from 'swagger-client'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createState } from 'stateUtils'
import * as sinopiaApi from 'sinopiaApi'

jest.mock('swagger-client')

const mockStore = configureMockStore([thunk])

describe('fetchSinopiaSearchResults', () => {
  const query = '*'
  const mockSearchResults = {
    totalHits: 1,
    results: {
      uri: 'http://sinopia.io/resource/123',
      label: 'A lonely title',
    },
  }

  const mockFacetResults = {
    types: [
      {
        key: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
        doc_count: 1,
      },
    ],
  }

  it('dispatches actions', async () => {
    server.getSearchResultsWithFacets = jest.fn().mockResolvedValue([mockSearchResults, mockFacetResults])
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())
    await store.dispatch(fetchSinopiaSearchResults(query, {
      startOfRange: 5, resultsPerPage: 10, sortField: 'label', sortOrder: 'desc',
    }))

    const actions = store.getActions()

    expect(actions).toHaveLength(1)
    expect(actions[0]).toStrictEqual({
      type: 'SET_SEARCH_RESULTS',
      payload: {
        searchType: 'resource',
        error: undefined,
        uri: 'sinopia',
        query: '*',
        results: mockSearchResults.results,
        totalResults: mockSearchResults.totalHits,
        facetResults: mockFacetResults,
        options: {
          sortField: 'label',
          sortOrder: 'desc',
          startOfRange: 5,
          resultsPerPage: 10,
        },
      },
    })
    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith('Foo McBar', 'search', '76541d5398cb6aa99cd74c6dfb7a54b9', '{"authorityUri":"sinopia","query":"*"}')
  })
})

describe('fetchQASearchResults', () => {
  const query = '*'
  const uri = 'urn:ld4p:qa:sharevde_stanford_ld4l_cache:all'
  it('dispatches action', async () => {
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
    const mockActionFunction = jest.fn().mockResolvedValue({ body: { results: mockSearchResults, response_header: { total_records: 15 } } })
    const client = { apis: { SearchQuery: { GET_searchAuthority: mockActionFunction } } }
    Swagger.mockResolvedValue(client)
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()

    const store = mockStore(createState())
    await store.dispatch(fetchQASearchResults(query, uri))

    const actions = store.getActions()

    expect(actions).toHaveLength(1)
    expect(actions[0]).toStrictEqual({
      type: 'SET_SEARCH_RESULTS',
      payload: {
        searchType: 'resource',
        uri,
        query,
        results: mockSearchResults,
        totalResults: 15,
        options: {},
        error: undefined,
        facetResults: {},
      },
    })
    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith('Foo McBar', 'search', '4682c287952df68172c6c4a63bdc2887', '{"authorityUri":"urn:ld4p:qa:sharevde_stanford_ld4l_cache:all","query":"*"}')
  })

  it('dispatches action when error', async () => {
    const mockActionFunction = jest.fn().mockRejectedValue(new Error('Ooops...'))
    const client = { apis: { SearchQuery: { GET_searchAuthority: mockActionFunction } } }
    Swagger.mockResolvedValue(client)

    const store = mockStore(createState())
    await store.dispatch(fetchQASearchResults(query, uri))

    const actions = store.getActions()

    expect(actions).toHaveLength(1)
    expect(actions[0]).toStrictEqual({
      type: 'SET_SEARCH_RESULTS',
      payload: {
        searchType: 'resource',
        uri,
        query,
        results: [],
        totalResults: 0,
        options: {},
        facetResults: {},
        error: 'Ooops...',
      },
    })
  })
})
