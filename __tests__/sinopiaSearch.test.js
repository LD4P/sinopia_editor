// Copyright 2019 Stanford University see LICENSE for license
import {
  getSearchResults,
  getTemplateSearchResults,
  getLookupResult,
  getSearchResultsWithFacets,
  getTemplateSearchResultsByIds,
  getSearchResultsByUris,
} from "sinopiaSearch"
import { findAuthorityConfig } from "utilities/authorityConfig"

describe("getSearchResults", () => {
  const successResult = {
    took: 8,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: 2 },
      max_score: 0.2876821,
      hits: [
        {
          _index: "sinopia_resources",
          _type: "sinopia",
          _id: "resource/34ef053e-f558-4299-a8a7-c8b79a598d99",
          _score: 0.2876821,
          _source: {
            title: ["foo bar"],
            uri: "http://platform:8080/resource/34ef053e-f558-4299-a8a7-c8b79a598d99",
            label: "foo bar",
            type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
            group: "cornell",
            created: "2019-11-27T19:05:48.496Z",
            modified: "2019-11-27T19:05:48.496Z",
          },
        },
        {
          _index: "sinopia_resources",
          _type: "sinopia",
          _id: "resource/cornell/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe",
          _score: 0.2876821,
          _source: {
            title: ["foo"],
            subtitle: [],
            uri: "http://platform:8080/resource/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe",
            label: "foo",
            type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
            group: "cornell",
            created: "2019-11-27T19:05:48.496Z",
            modified: "2019-11-27T19:05:48.496Z",
          },
        },
      ],
    },
  }

  const errorResult = {
    error: {
      root_cause: [
        {
          type: "parsing_exception",
          reason: "[simple_query_string] unsupported field [xdefault_operator]",
          line: 1,
          col: 90,
        },
      ],
      type: "parsing_exception",
      reason: "[simple_query_string] unsupported field [xdefault_operator]",
      line: 1,
      col: 90,
    },
  }

  it("performs a search with default sort order and returns results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => successResult }))

    const results = await getSearchResults("foo")
    expect(results).toEqual({
      totalHits: 2,
      results: [
        {
          uri: "http://platform:8080/resource/34ef053e-f558-4299-a8a7-c8b79a598d99",
          label: "foo bar",
          created: "2019-11-27T19:05:48.496Z",
          modified: "2019-11-27T19:05:48.496Z",
          type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
          group: "cornell",
        },
        {
          uri: "http://platform:8080/resource/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe",
          label: "foo",
          created: "2019-11-27T19:05:48.496Z",
          modified: "2019-11-27T19:05:48.496Z",
          type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
          group: "cornell",
        },
      ],
    })
    const body = {
      query: {
        bool: {
          must: {
            simple_query_string: {
              fields: ["title^3", "subtitle^2", "uri^3", "text"],
              default_operator: "AND",
              query: "foo",
            },
          },
        },
      },
      from: 0,
      size: 10,
      sort: ["_score"],
    }
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/sinopia_resources/_search",
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    )
  })

  it("performs a search with specified page and sort order and returns results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => successResult }))
    await getSearchResults("foo", {
      startOfRange: 10,
      resultsPerPage: 15,
      sortField: "label",
      sortOrder: "desc",
    })
    const body = {
      query: {
        bool: {
          must: {
            simple_query_string: {
              fields: ["title^3", "subtitle^2", "uri^3", "text"],
              default_operator: "AND",
              query: "foo",
            },
          },
        },
      },
      from: 10,
      size: 15,
      sort: [
        {
          label: "desc",
        },
      ],
    }
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/sinopia_resources/_search",
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    )
  })

  it("performs a search and handles ES error", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => errorResult }))

    const results = await getSearchResults("foo")
    expect(results).toEqual({
      totalHits: 0,
      results: [],
      error: "[simple_query_string] unsupported field [xdefault_operator]",
    })
  })

  it("performs a search and handles raised error", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error("Frickin network")))

    const results = await getSearchResults("foo")
    expect(results).toEqual({
      totalHits: 0,
      results: [],
      error: "Error: Frickin network",
    })
  })
})

describe("getSearchResultsWithFacets", () => {
  const successResult = {
    took: 5,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: 2 },
      max_score: 1,
      hits: [
        {
          _index: "sinopia_resources",
          _type: "sinopia",
          _id: "resource/cornell/f2b0291d-b679-4560-bd03-d3eb3b6fa187",
          _score: 1,
          _source: {
            uri: "http://platform:8080/resource/f2b0291d-b679-4560-bd03-d3eb3b6fa187",
            title: ["foo"],
            label: "foo",
            text: ["foo"],
            created: "2019-11-27T19:05:48.496Z",
            modified: "2019-11-27T19:05:48.496Z",
            type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
            group: "cornell",
          },
        },
        {
          _index: "sinopia_resources",
          _type: "sinopia",
          _id: "resource/duke/718e77f1-a07d-4579-ad56-0c93bd3067ea",
          _score: 1,
          _source: {
            uri: "http://platform:8080/resource/718e77f1-a07d-4579-ad56-0c93bd3067ea",
            title: ["bar"],
            label: "bar",
            text: ["bar"],
            created: "2019-11-27T19:07:03.643Z",
            modified: "2019-11-27T19:07:03.643Z",
            type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
            group: "duke",
          },
        },
      ],
    },
    aggregations: {
      types: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
            doc_count: 2,
          },
        ],
      },
      groups: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: "cornell",
            doc_count: 1,
          },
          {
            key: "duke",
            doc_count: 1,
          },
        ],
      },
    },
  }

  it("performs a search with defaults and returns results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => successResult }))

    const results = await getSearchResultsWithFacets("foo")
    expect(results).toEqual([
      {
        totalHits: 2,
        results: [
          {
            uri: "http://platform:8080/resource/f2b0291d-b679-4560-bd03-d3eb3b6fa187",
            label: "foo",
            created: "2019-11-27T19:05:48.496Z",
            modified: "2019-11-27T19:05:48.496Z",
            type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
            group: "cornell",
          },
          {
            uri: "http://platform:8080/resource/718e77f1-a07d-4579-ad56-0c93bd3067ea",
            label: "bar",
            created: "2019-11-27T19:07:03.643Z",
            modified: "2019-11-27T19:07:03.643Z",
            type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
            group: "duke",
          },
        ],
      },
      {
        types: [
          {
            key: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
            doc_count: 2,
          },
        ],
        groups: [
          {
            key: "cornell",
            doc_count: 1,
          },
          {
            key: "duke",
            doc_count: 1,
          },
        ],
      },
    ])
    const body = {
      query: {
        bool: {
          must: {
            simple_query_string: {
              fields: ["title^3", "subtitle^2", "uri^3", "text"],
              default_operator: "AND",
              query: "foo",
            },
          },
        },
      },
      from: 0,
      size: 10,
      sort: ["_score"],
      aggs: {
        types: {
          terms: {
            field: "type",
          },
        },
        groups: {
          terms: {
            field: "group",
            size: 20,
          },
        },
      },
    }
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/sinopia_resources/_search",
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    )
  })

  it("performs a search with specified filters and no aggs and returns results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => successResult }))

    await getSearchResultsWithFacets("foo", {
      typeFilter: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
      groupFilter: ["cornell"],
      noFacetResults: true,
    })
    const body = {
      query: {
        bool: {
          must: {
            simple_query_string: {
              fields: ["title^3", "subtitle^2", "uri^3", "text"],
              default_operator: "AND",
              query: "foo",
            },
          },
          filter: [
            {
              terms: {
                type: [
                  "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
                ],
              },
            },
            {
              terms: {
                group: ["cornell"],
              },
            },
          ],
        },
      },
      from: 0,
      size: 10,
      sort: ["_score"],
    }
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/sinopia_resources/_search",
      {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    )
  })
})

describe("getLookupResult", () => {
  describe("for a non-template authority with results", () => {
    const lookupConfig = findAuthorityConfig("urn:ld4p:sinopia:bibframe:work")
    const workResult = {
      took: 12,
      timed_out: false,
      _shards: {
        total: 5,
        successful: 5,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: { value: 1 },
        max_score: 0.53412557,
        hits: [
          {
            _index: "sinopia_resources",
            _type: "sinopia",
            _id: "resource/3519e138-0f07-46a6-bd82-d4804c3b4890",
            _score: 0.53412557,
            _source: {
              uri: "http://platform:8080/resource/3519e138-0f07-46a6-bd82-d4804c3b4890",
              title: ["Foo"],
              label: "Foo",
              text: ["Foo"],
              created: "2019-11-03T15:04:18.015Z",
              modified: "2019-11-03T15:04:18.015Z",
              type: ["http://id.loc.gov/ontologies/bibframe/Work"],
            },
          },
        ],
      },
    }
    it("performs a search and returns result", async () => {
      global.fetch = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ json: () => workResult }))

      const result = await getLookupResult("foo", lookupConfig)
      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            uri: "http://platform:8080/resource/3519e138-0f07-46a6-bd82-d4804c3b4890",
            label: "Foo",
            created: "2019-11-03T15:04:18.015Z",
            modified: "2019-11-03T15:04:18.015Z",
            type: ["http://id.loc.gov/ontologies/bibframe/Work"],
          },
        ],
      })
    })
  })

  describe("for a non-template authority with no results", () => {
    const lookupConfig = findAuthorityConfig(
      "urn:ld4p:sinopia:bibframe:instance"
    )
    const instanceResult = {
      took: 5,
      timed_out: false,
      _shards: {
        total: 5,
        successful: 5,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: { value: 0 },
        max_score: null,
        hits: [],
      },
    }

    it("performs a search and returns result", async () => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({ json: () => instanceResult })
        )

      const result = await getLookupResult("foo", lookupConfig)
      expect(result).toEqual({
        totalHits: 0,
        results: [],
      })
    })
  })

  describe("for template authority", () => {
    const lookupConfig = findAuthorityConfig(
      "urn:ld4p:sinopia:resourceTemplate"
    )

    it("performs a search and returns result", async () => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({ json: () => templateResult })
        )

      const result = await getLookupResult("foo", lookupConfig)
      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            label:
              "Cartographic Item (BIBFRAME) (ld4p:RT:bf2:Cartographic:Item)",
            uri: "ld4p:RT:bf2:Cartographic:Item",
            author: "LD4P",
            date: "2019-08-19",
            id: "ld4p:RT:bf2:Cartographic:Item",
            remark: "based on LC template ld4p:RT:bf2:Cartographic:Item",
            resourceLabel: "Cartographic Item (BIBFRAME)",
            resourceURI: "http://id.loc.gov/ontologies/bibframe/Item",
          },
        ],
      })
    })
  })
})

const templateResult = {
  took: 19,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 1,
      relation: "eq",
    },
    hits: [
      {
        _index: "sinopia_templates",
        _type: "sinopia",
        _id: "ld4p:RT:bf2:Cartographic:Item",
        _score: null,
        _source: {
          id: "ld4p:RT:bf2:Cartographic:Item",
          uri: "http://localhost:3000/resource/ld4p:RT:bf2:Cartographic:Item",
          author: "LD4P",
          date: "2019-08-19",
          remark: "based on LC template ld4p:RT:bf2:Cartographic:Item",
          resourceLabel: "Cartographic Item (BIBFRAME)",
          resourceURI: "http://id.loc.gov/ontologies/bibframe/Item",
        },
        sort: ["cartographic item (bibframe)"],
      },
    ],
  },
}

describe("getTemplateSearchResults", () => {
  it("returns results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => templateResult }))
    const results = await getTemplateSearchResults("Cartographic:Item")

    expect(results).toEqual({
      totalHits: 1,
      results: [
        {
          id: "ld4p:RT:bf2:Cartographic:Item",
          uri: "http://localhost:3000/resource/ld4p:RT:bf2:Cartographic:Item",
          author: "LD4P",
          date: "2019-08-19",
          remark: "based on LC template ld4p:RT:bf2:Cartographic:Item",
          resourceLabel: "Cartographic Item (BIBFRAME)",
          resourceURI: "http://id.loc.gov/ontologies/bibframe/Item",
        },
      ],
      error: undefined,
    })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/sinopia_templates/_search",
      {
        body: '{"query":{"bool":{"should":[{"wildcard":{"id":{"value":"*Cartographic:Item*"}}},{"wildcard":{"resourceLabel":{"value":"*Cartographic:Item*"}}},{"wildcard":{"resourceURI":{"value":"*Cartographic:Item*"}}},{"wildcard":{"remark":{"value":"*Cartographic:Item*"}}},{"wildcard":{"author":{"value":"*Cartographic:Item*"}}},{"wildcard":{"groupLabel":{"value":"*Cartographic:Item*"}}}]}},"sort":[{"resourceLabel":"asc"}],"size":250,"from":0}',
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    )
  })

  it("returns 504 timeout error if Sinopia server is unavailable", async () => {
    const searchDownResult = {
      totalHits: 0,
      results: [],
      error: "504: Gateway Timout",
    }

    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ json: () => searchDownResult })
      )
    const results = await getTemplateSearchResults("Palo Alto")
    expect(results).toEqual({
      totalHits: 0,
      results: [],
      error: "504: Gateway Timout",
    })
  })
})

describe("getTemplateSearchResultsByIds", () => {
  it("returns results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => templateResult }))
    const results = await getTemplateSearchResultsByIds([
      "ld4p:RT:bf2:Cartographic:Item",
    ])

    expect(results).toEqual({
      totalHits: 1,
      results: [
        {
          id: "ld4p:RT:bf2:Cartographic:Item",
          uri: "http://localhost:3000/resource/ld4p:RT:bf2:Cartographic:Item",
          author: "LD4P",
          date: "2019-08-19",
          remark: "based on LC template ld4p:RT:bf2:Cartographic:Item",
          resourceLabel: "Cartographic Item (BIBFRAME)",
          resourceURI: "http://id.loc.gov/ontologies/bibframe/Item",
        },
      ],
      error: undefined,
    })

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/sinopia_templates/_search",
      {
        body: '{"query":{"terms":{"id":["ld4p:RT:bf2:Cartographic:Item"]}},"size":1}',
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    )
  })
})

describe("getSearchResultsByUris", () => {
  const successResult = {
    took: 2,
    timed_out: false,
    hits: {
      total: {
        value: 1,
        relation: "eq",
      },
      hits: [
        {
          _index: "sinopia_resources",
          _type: "sinopia",
          _id: "3d831f47-e686-4b8f-9086-11383b2af762",
          _score: 1,
          _source: {
            uri: "http://localhost:3000/resource/3d831f47-e686-4b8f-9086-11383b2af762",
            label:
              "http://localhost:3000/resource/3d831f47-e686-4b8f-9086-11383b2af762",
            text: ["ld4p:RT:bf2:Contents", "Foobar"],
            modified: "2020-10-05T14:31:16.563Z",
            type: ["http://id.loc.gov/ontologies/bibframe/TableOfContents"],
            group: "stanford",
          },
        },
      ],
    },
  }

  it("performs a search and returns results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => successResult }))

    const results = await getSearchResultsByUris([
      "http://localhost:3000/resource/3d831f47-e686-4b8f-9086-11383b2af762",
    ])
    expect(results).toEqual({
      totalHits: 1,
      results: [
        {
          uri: "http://localhost:3000/resource/3d831f47-e686-4b8f-9086-11383b2af762",
          label:
            "http://localhost:3000/resource/3d831f47-e686-4b8f-9086-11383b2af762",
          modified: "2020-10-05T14:31:16.563Z",
          type: ["http://id.loc.gov/ontologies/bibframe/TableOfContents"],
          group: "stanford",
          created: undefined,
        },
      ],
    })
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/search/sinopia_resources/_search",
      {
        body: '{"query":{"terms":{"uri":["http://localhost:3000/resource/3d831f47-e686-4b8f-9086-11383b2af762"]}},"size":1}',
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    )
  })
})
