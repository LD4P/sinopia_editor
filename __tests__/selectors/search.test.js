import {
  selectSearchError,
  selectSearchUri,
  selectSearchQuery,
  selectSearchTotalResults,
  selectSearchFacetResults,
  selectSearchOptions,
  selectSearchResults,
} from "selectors/search"

const state = {
  search: {
    resource: {
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
      error: "Ooops",
    },
  },
}

describe("selectSearchError()", () => {
  describe("with search", () => {
    it("returns error", () => {
      expect(selectSearchError(state, "resource")).toEqual("Ooops")
    })
  })
  describe("without search", () => {
    it("returns undefined", () => {
      expect(selectSearchError(state, "template")).toBe(undefined)
    })
  })
})

describe("selectSearchUri()", () => {
  describe("with search", () => {
    it("returns uri", () => {
      expect(selectSearchUri(state, "resource")).toEqual("https://sinopia.io")
    })
  })
  describe("without search", () => {
    it("returns undefined", () => {
      expect(selectSearchUri(state, "template")).toBe(undefined)
    })
  })
})

describe("selectSearchQuery()", () => {
  describe("with search", () => {
    it("returns query", () => {
      expect(selectSearchQuery(state, "resource")).toEqual("More")
    })
  })
  describe("without search", () => {
    it("returns undefined", () => {
      expect(selectSearchQuery(state, "template")).toBe(undefined)
    })
  })
})

describe("selectSearchTotalResults()", () => {
  describe("with search", () => {
    it("returns total results", () => {
      expect(selectSearchTotalResults(state, "resource")).toEqual(1)
    })
  })
  describe("without search", () => {
    it("returns undefined", () => {
      expect(selectSearchTotalResults(state, "template")).toBe(0)
    })
  })
})

describe("selectSearchFacetResults()", () => {
  describe("with search", () => {
    it("returns facets", () => {
      expect(selectSearchFacetResults(state, "resource", "types")).toEqual([
        {
          key: "http://id.loc.gov/ontologies/bibframe/Instance",
          doc_count: 1,
        },
      ])
    })
  })
  describe("without search", () => {
    it("returns undefined", () => {
      expect(selectSearchFacetResults(state, "template", "types")).toEqual(
        undefined
      )
    })
  })
  describe("without facets", () => {
    it("returns undefined", () => {
      expect(selectSearchFacetResults(state, "resource", "groups")).toEqual(
        undefined
      )
    })
  })
})

describe("selectSearchOptions()", () => {
  describe("with search", () => {
    it("returns options", () => {
      expect(selectSearchOptions(state, "resource")).toEqual({
        startOfRange: 0,
        resultsPerPage: 10,
        groupFilter: undefined,
        sortField: undefined,
        sortOrder: undefined,
        typeFilter: undefined,
      })
    })
  })
  describe("without search", () => {
    it("returns default options", () => {
      expect(selectSearchOptions(state, "template")).toEqual({
        startOfRange: 0,
        resultsPerPage: 250,
      })
    })
  })
})

describe("selectSearchResults()", () => {
  describe("with search", () => {
    it("returns results", () => {
      expect(selectSearchResults(state, "resource")).toEqual([
        {
          uri: "http://stage.sinpia.io/resource/8e4d3e69-1d5f-4112-968b-96d86a163895",
          label: "More and more and more",
          created: "2020-07-15T20:42:16.515Z",
          modified: "2020-07-15T20:42:16.515Z",
          type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
          group: "frick",
        },
      ])
    })
  })
  describe("without search", () => {
    it("returns undefined", () => {
      expect(selectSearchResults(state, "template")).toEqual(undefined)
    })
  })
})
