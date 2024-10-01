// Copyright 2019 Stanford University see LICENSE for license
import {
  fetchSinopiaSearchResults,
  fetchQASearchResults,
  fetchTemplateGuessSearchResults,
} from "actionCreators/search"
import * as server from "sinopiaSearch"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"
import * as sinopiaApi from "sinopiaApi"
import * as QuestioningAuthority from "utilities/QuestioningAuthority"

const mockStore = configureMockStore([thunk])

describe("fetchSinopiaSearchResults", () => {
  const query = "*"
  const mockSearchResults = {
    totalHits: 1,
    results: [
      {
        uri: "http://sinopia.io/resource/123",
        label: "A lonely title",
        type: ["http://id.loc.gov/ontologies/bibframe/Item"],
      },
    ],
  }

  const mockFacetResults = {
    types: [
      {
        key: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
        doc_count: 1,
      },
    ],
  }

  jest.spyOn(sinopiaApi, "fetchResourceRelationships").mockResolvedValue({})

  it("dispatches actions", async () => {
    server.getSearchResultsWithFacets = jest
      .fn()
      .mockResolvedValue([mockSearchResults, mockFacetResults])
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())
    await store.dispatch(
      fetchSinopiaSearchResults(
        query,
        {
          startOfRange: 5,
          resultsPerPage: 10,
          sortField: "label",
          sortOrder: "desc",
        },
        "testerrorkey"
      )
    )

    const actions = store.getActions()

    expect(actions).toHaveLength(4)
    expect(actions).toHaveAction("CLEAR_ERRORS")
    expect(actions).toHaveAction("SET_SEARCH_RESULTS", {
      searchType: "resource",
      error: undefined,
      uri: "urn:ld4p:sinopia",
      query: "*",
      results: mockSearchResults.results,
      totalResults: mockSearchResults.totalHits,
      facetResults: mockFacetResults,
      options: {
        sortField: "label",
        sortOrder: "desc",
        startOfRange: 5,
        resultsPerPage: 10,
      },
    })
    expect(actions).toHaveAction("ADD_SEARCH_HISTORY", {
      authorityUri: "urn:ld4p:sinopia",
      authorityLabel: "Sinopia resources",
      query: "*",
    })
    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
      "Foo McBar",
      "search",
      "e983591a38cf0e7a8d9a2a1e3251a1b6",
      '{"authorityUri":"urn:ld4p:sinopia","query":"*"}'
    )
  })
})

describe("fetchQASearchResults", () => {
  const query = "*"
  const uri = "urn:ld4p:qa:oclc_fast:topic"

  describe("when happy path", () => {
    const mockSearchResults = [
      {
        uri: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365",
        id: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365",
        label: "These twain",
        context: [
          {
            property: "Title",
            values: [" These twain"],
            selectable: true,
            drillable: false,
          },
          {
            property: "Type",
            values: [
              "http://id.loc.gov/ontologies/bflc/Hub",
              "http://id.loc.gov/ontologies/bibframe/Work",
            ],
            selectable: false,
            drillable: false,
          },
          {
            property: "Contributor",
            values: ["Bennett, Arnold,1867-1931."],
            selectable: false,
            drillable: false,
          },
        ],
      },
      {
        uri: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365-1",
        id: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365-1",
        label: "These twain",
        context: [
          {
            property: "Title",
            values: [" These twain"],
            selectable: true,
            drillable: false,
          },
          {
            property: "Type",
            values: [
              "http://id.loc.gov/ontologies/bibframe/Text",
              "http://id.loc.gov/ontologies/bibframe/Work",
            ],
            selectable: false,
            drillable: false,
          },
          {
            property: "Contributor",
            values: ["Bennett, Arnold,1867-1931."],
            selectable: false,
            drillable: false,
          },
        ],
      },
    ]
    const mockResponse = {
      results: mockSearchResults,
      response_header: { total_records: 15 },
    }

    beforeEach(() => {
      jest
        .spyOn(QuestioningAuthority, "createLookupPromise")
        .mockResolvedValue(mockResponse)
    })

    it("dispatches action", async () => {
      sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()

      const store = mockStore(createState())
      await store.dispatch(fetchQASearchResults(query, uri, "testerrorkey"))

      const actions = store.getActions()

      expect(actions).toHaveLength(3)
      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("SET_SEARCH_RESULTS", {
        searchType: "resource",
        uri,
        query,
        results: mockSearchResults,
        totalResults: 15,
        options: {},
        error: undefined,
        facetResults: {},
      })
      expect(actions).toHaveAction("ADD_SEARCH_HISTORY", {
        authorityUri: uri,
        authorityLabel: "OCLCFAST Topic (QA) - direct",
        query,
      })
      expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
        "Foo McBar",
        "search",
        "7c944f41fb8b8bba92311b4f4f48ceb3",
        '{"authorityUri":"urn:ld4p:qa:oclc_fast:topic","query":"*"}'
      )
    })
  })

  describe("when error occurs", () => {
    beforeEach(() => {
      jest
        .spyOn(QuestioningAuthority, "createLookupPromise")
        .mockResolvedValue({
          isError: true,
          errorObject: new Error("Ooops..."),
        })
    })

    it("dispatches action when error", async () => {
      const store = mockStore(createState())
      await store.dispatch(fetchQASearchResults(query, uri, "testerrorkey"))

      const actions = store.getActions()

      expect(actions).toHaveLength(3)
      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("SET_SEARCH_RESULTS", {
        searchType: "resource",
        uri,
        query,
        results: [],
        totalResults: 0,
        options: {},
        facetResults: {},
        error: "Ooops...",
      })
      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error: "An error occurred while searching: Ooops...",
      })
    })
  })
})

describe("fetchTemplateGuessSearchResults", () => {
  describe("when success", () => {
    const query = "date"
    const mockSearchResults = {
      totalHits: 1,
      results: [
        {
          id: "testing:defaultDate",
          uri: "http://localhost:3000/resource/testing:defaultDate",
          resourceLabel: "Default date",
          resourceURI: "http://testing/defaultDate",
          group: "other",
          editGroups: [],
          groupLabel: "Other",
        },
      ],
    }

    it("dispatches actions", async () => {
      server.getTemplateSearchResults = jest
        .fn()
        .mockResolvedValue(mockSearchResults)
      const store = mockStore(createState())
      await store.dispatch(
        fetchTemplateGuessSearchResults(query, "testerrorkey", {
          startOfRange: 0,
        })
      )

      const actions = store.getActions()

      expect(actions).toHaveLength(1)
      expect(actions).toHaveAction("SET_SEARCH_RESULTS", {
        searchType: "templateguess",
        error: undefined,
        uri: null,
        query,
        results: mockSearchResults.results,
        totalResults: mockSearchResults.totalHits,
        facetResults: {},
        options: {
          startOfRange: 0,
        },
      })
    })
  })
  describe("when failure", () => {
    const query = "date"

    const mockSearchResults = {
      totalHits: 0,
      results: [],
      error: "Ooops",
    }

    it("dispatches actions", async () => {
      server.getTemplateSearchResults = jest
        .fn()
        .mockResolvedValue(mockSearchResults)
      const store = mockStore(createState())
      await store.dispatch(
        fetchTemplateGuessSearchResults(query, "testerrorkey", {
          startOfRange: 0,
        })
      )

      const actions = store.getActions()

      expect(actions).toHaveLength(2)
      expect(actions).toHaveAction("SET_SEARCH_RESULTS", {
        searchType: "templateguess",
        error: "Ooops",
        uri: null,
        query,
        results: [],
        totalResults: 0,
        facetResults: {},
        options: {
          startOfRange: 0,
        },
      })
      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error: "Error searching for templates: Ooops",
      })
    })
  })
})
