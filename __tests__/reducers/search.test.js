// Copyright 2020 Stanford University see LICENSE for license

import { clearSearchResults, setSearchResults } from "reducers/search"

import { createReducer } from "reducers/index"

const reducers = {
  CLEAR_SEARCH_RESULTS: clearSearchResults,
  SET_SEARCH_RESULTS: setSearchResults,
}

const reducer = createReducer(reducers)

const searchExample = {
  results: [
    {
      uri: "http://stage.sinpia.io/resource/8e4d3e69-1d5f-4112-968b-96d86a163895",
      label: "More and more and more",
      created: "2020-07-15T20:42:16.515Z",
      modified: "2020-07-15T20:42:16.515Z",
      type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
      group: "frick",
    },
  ],
  totalResults: 1,
  facetResults: {
    types: [
      {
        key: "http://id.loc.gov/ontologies/bibframe/Instance",
        doc_count: 1,
      },
    ],
    groups: [
      {
        key: "frick",
        doc_count: 1,
      },
    ],
  },
  query: "More",
  options: {
    startOfRange: 0,
    resultsPerPage: 10,
    groupFilter: undefined,
    sortField: undefined,
    sortOrder: undefined,
    typeFilter: undefined,
  },
  uri: "https://sinopia.io",
  error: undefined,
}

const templatesSearchExample = {
  results: [
    {
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      author: "LD4P",
      date: "2019-08-19",
      resourceLabel: "Abbreviated Title",
      resourceURI: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
    },
    {
      id: "resourceTemplate:bf2:Identifiers:Shelfmark",
      resourceLabel: "Accession or copy number",
      resourceURI: "http://id.loc.gov/ontologies/bibframe/ShelfMark",
    },
    {
      id: "ld4p:RT:bf2:Agents:Addresses",
      author: "LD4P",
      date: "2019-08-19",
      resourceLabel: "Addresses",
      resourceURI: "http://www.loc.gov/mads/rdf/v1#Address",
    },
  ],
  totalResults: 3,
  options: {
    startOfRange: 0,
    resultsPerPage: 10,
  },
  error: undefined,
}

describe("clearSearchResults()", () => {
  it("removes search-related variables", () => {
    const oldState = {
      resource: searchExample,
      template: templatesSearchExample,
    }
    const action = {
      type: "CLEAR_SEARCH_RESULTS",
      payload: "resource",
    }
    const newState = reducer(oldState, action)
    expect(newState.resource).toBe(null)
    expect(newState.template).toEqual(templatesSearchExample)
  })
})

describe("setSearchResults()", () => {
  it("adds search results", () => {
    const oldState = {
      resource: null,
    }

    const action = {
      type: "SET_SEARCH_RESULTS",
      payload: {
        ...searchExample,
        searchType: "resource",
      },
    }
    const newState = reducer(oldState, action)
    expect(newState.resource).toStrictEqual({
      ...searchExample,
      relationshipResults: {},
    })
  })

  it("sets defaults for options", () => {
    const oldState = {
      template: null,
    }

    const action = {
      type: "SET_SEARCH_RESULTS",
      payload: {
        ...templatesSearchExample,
        searchType: "template",
        options: {},
      },
    }
    const newState = reducer(oldState, action)
    expect(newState.template.options.resultsPerPage).toEqual(250)
    expect(newState.template.options.startOfRange).toEqual(0)
  })
})
