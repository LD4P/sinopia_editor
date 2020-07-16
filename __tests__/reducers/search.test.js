// Copyright 2020 Stanford University see LICENSE for license

import {
  clearSearchResults, clearTemplateSearchResults, setSearchResults,
  setTemplateSearchResults,
} from 'reducers/search'

import { createReducer } from 'reducers/index'

const reducers = {
  CLEAR_SEARCH_RESULTS: clearSearchResults,
  CLEAR_TEMPLATE_SEARCH_RESULTS: clearTemplateSearchResults,
  SET_SEARCH_RESULTS: setSearchResults,
  SET_TEMPLATE_SEARCH_RESULTS: setTemplateSearchResults,
}

const reducer = createReducer(reducers)

const searchExample = {
  results: [
    {
      uri: 'http://stage.sinpia.io/repository/frick/8e4d3e69-1d5f-4112-968b-96d86a163895',
      label: 'More and more and more',
      created: '2020-07-15T20:42:16.515Z',
      modified: '2020-07-15T20:42:16.515Z',
      type: [
        'http://id.loc.gov/ontologies/bibframe/Instance',
      ],
      group: 'frick',
    },
  ],
  totalResults: 1,
  facetResults: {
    types: [
      {
        key: 'http://id.loc.gov/ontologies/bibframe/Instance',
        doc_count: 1,
      },
    ],
    groups: [
      {
        key: 'frick',
        doc_count: 1,
      },
    ],
  },
  query: 'More',
  options: {
    startOfRange: 0,
    resultsPerPage: 10,
  },
  uri: 'https://sinopia.io',
}

const templatesSearchExample = {
  results: [
    {
      id: 'ld4p:RT:bf2:Title:AbbrTitle',
      author: 'LD4P',
      date: '2019-08-19',
      resourceLabel: 'Abbreviated Title',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
    },
    {
      id: 'resourceTemplate:bf2:Identifiers:Shelfmark',
      resourceLabel: 'Accession or copy number',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/ShelfMark',
    },
    {
      id: 'ld4p:RT:bf2:Agents:Addresses',
      author: 'LD4P',
      date: '2019-08-19',
      resourceLabel: 'Addresses',
      resourceURI: 'http://www.loc.gov/mads/rdf/v1#Address',
    },
  ],
  totalResults: 3,
  options: {
    startOfRange: 0,
    resultsPerPage: 10,
  },
}

describe('clearSearchResults()', () => {
  it('removes search-related variables', () => {
    const oldState = {
      search: searchExample,
    }
    const action = {
      type: 'CLEAR_SEARCH_RESULTS',
    }
    const newState = reducer(oldState, action)
    expect(newState.search.results).toHaveLength(0)
    expect(newState.search.query).toBe(undefined)
    expect(newState.search.options.startOfRange).toBe(0)
  })
})

describe('clearTemplateSearchResults()', () => {
  it('removes template-related search variables', () => {
    const oldState = {
      templateSearch: templatesSearchExample,
    }
    const action = {
      type: 'CLEAR_TEMPLATE_SEARCH_RESULTS',
    }
    const newState = reducer(oldState, action)
    expect(newState.templateSearch.results).toHaveLength(0)
    expect(newState.templateSearch.totalResults).toBe(0)
  })
})

describe('setSearchResults()', () => {
  it('adds search results', () => {
    const oldState = {
      search: {
        results: [],
        uri: undefined,
        query: undefined,
        options: {
          startOfRange: 0,
          sortOrder: undefined,
          typeFilter: undefined,
          groupFilter: undefined,
        },
        error: undefined,
      },
    }
    // Changes to the expected search payload
    const newSearch = { ...searchExample }
    newSearch.searchResults = newSearch.results
    delete newSearch.results

    const action = {
      type: 'SET_SEARCH_RESULTS',
      payload: newSearch,
    }
    const newState = reducer(oldState, action)
    expect(newState.search.results[0].uri).toBe('http://stage.sinpia.io/repository/frick/8e4d3e69-1d5f-4112-968b-96d86a163895')
    expect(newState.search.query).toBe('More')
  })
})

describe('setTemplateSearchResults()', () => {
  it('adds template search results', () => {
    const oldState = {
      templateSearch: {
        results: [],
        totalResults: 0,
        options: {},
        error: undefined,
      },
    }
    // Create a new templateSearch payload
    const newTemplateSearch = { ...templatesSearchExample }
    newTemplateSearch.searchResults = newTemplateSearch.results
    delete newTemplateSearch.results

    const action = {
      type: 'SET_TEMPLATE_SEARCH_RESULTS',
      payload: newTemplateSearch,
    }

    const newState = reducer(oldState, action)
    expect(newState.templateSearch.results).toHaveLength(3)
    expect(newState.templateSearch.options.startOfRange).toBe(0)
  })
})
