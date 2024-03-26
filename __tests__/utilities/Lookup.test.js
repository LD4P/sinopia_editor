import { getLookupResult } from "utilities/Lookup"
import * as sinopiaSearch from "sinopiaSearch"
import * as qaSearch from "utilities/QuestioningAuthority"
import { findAuthorityConfig } from "utilities/authorityConfig"

jest.mock("sinopiaSearch")
jest.mock("utilities/QuestioningAuthority")

describe("getLookupResult()", () => {
  describe("Sinopia lookup", () => {
    beforeEach(() => {
      sinopiaSearch.getLookupResult.mockResolvedValue({
        totalHits: 1,
        results: [
          {
            uri: "http://localhost:3000/resource/d336dee4-65e3-457f-9215-740531104681",
            label: "Foo",
            modified: "2021-10-15T21:10:12.615Z",
            type: ["http://id.loc.gov/ontologies/bibframe/Instance"],
            group: "other",
            editGroups: [],
          },
        ],
        error: undefined,
      })
    })
    it("returns result", async () => {
      const authorityConfig = findAuthorityConfig(
        "urn:ld4p:sinopia:bibframe:work"
      )
      const result = await getLookupResult("foo", authorityConfig, 10)

      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            context: [
              {
                property: "ID",
                values: [
                  "http://localhost:3000/resource/d336dee4-65e3-457f-9215-740531104681",
                ],
              },
              {
                property: "Group",
                values: ["other"],
              },
              {
                property: "Class",
                values: ["http://id.loc.gov/ontologies/bibframe/Instance"],
              },
              {
                property: "Modified",
                values: ["2021-10-15T21:10:12.615Z"],
              },
            ],
            id: "http://localhost:3000/resource/d336dee4-65e3-457f-9215-740531104681",
            label: "Foo",
            uri: "http://localhost:3000/resource/d336dee4-65e3-457f-9215-740531104681",
          },
        ],
        error: undefined,
        ...authorityConfig,
      })
      expect(sinopiaSearch.getLookupResult).toHaveBeenCalledWith(
        "foo",
        authorityConfig,
        { startOfRange: 10 }
      )
    })
  })

  describe("Sinopia template lookup", () => {
    beforeEach(() => {
      sinopiaSearch.getLookupResult.mockResolvedValue({
        totalHits: 1,
        results: [
          {
            id: "foo:bar2",
            uri: "http://localhost:3000/resource/foo:bar2",
            author: "Justin7",
            resourceLabel: "Foo Bar",
            resourceURI: "http://foo/bar",
            group: "stanford",
            editGroups: [],
            groupLabel: "Stanford",
          },
        ],
        error: undefined,
      })
    })
    it("returns result", async () => {
      const authorityConfig = findAuthorityConfig(
        "urn:ld4p:sinopia:resourceTemplate"
      )
      const result = await getLookupResult("foo", authorityConfig, 10)
      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            context: [
              {
                property: "ID",
                values: ["http://localhost:3000/resource/foo:bar2"],
              },
              {
                property: "Group",
                values: ["stanford"],
              },
              {
                property: "Resource URI",
                values: ["http://foo/bar"],
              },
              {
                property: "Author",
                values: ["Justin7"],
              },
            ],
            id: "http://localhost:3000/resource/foo:bar2",
            label: "Foo Bar",
            uri: "http://localhost:3000/resource/foo:bar2",
          },
        ],
        error: undefined,
        ...authorityConfig,
      })
      expect(sinopiaSearch.getLookupResult).toHaveBeenCalledWith(
        "foo",
        authorityConfig,
        { startOfRange: 10 }
      )
    })
  })

  describe("QA lookup", () => {
    beforeEach(() => {
      qaSearch.createLookupPromise.mockResolvedValue({
        response_header: {
          start_record: 1,
          requested_records: 1,
          retrieved_records: 1,
          total_records: 1,
        },
        results: [
          {
            uri: "http://data.ub.uio.no/humord/c60751",
            id: "http://data.ub.uio.no/humord/c60751",
            label: "Cornelia (Litterær karakter)",
          },
        ],
      })
    })
    it("returns result", async () => {
      const authorityConfig = findAuthorityConfig("urn:ld4p:qa:humord_direct")
      const result = await getLookupResult("corn", authorityConfig, 5)
      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            uri: "http://data.ub.uio.no/humord/c60751",
            id: "http://data.ub.uio.no/humord/c60751",
            label: "Cornelia (Litterær karakter)",
          },
        ],
        error: undefined,
        authorityConfig,
      })
      expect(qaSearch.createLookupPromise).toHaveBeenCalledWith(
        "corn",
        authorityConfig,
        { startOfRange: 5 }
      )
    })
  })
  describe("QA lookup with bad total_records", () => {
    qaSearch.createLookupPromise = jest.fn().mockResolvedValue({
      response_header: {
        start_record: 1,
        requested_records: 1,
        retrieved_records: 1,
        total_records: "NOT_REPORTED",
      },
      results: [
        {
          uri: "http://data.ub.uio.no/humord/c60751",
          id: "http://data.ub.uio.no/humord/c60751",
          label: "Cornelia (Litterær karakter)",
        },
      ],
    })
    it("returns result", async () => {
      const authorityConfig = findAuthorityConfig("urn:ld4p:qa:humord_direct")
      const result = await getLookupResult("corn", authorityConfig, 5)
      expect(result).toEqual({
        totalHits: 1,
        results: [
          {
            uri: "http://data.ub.uio.no/humord/c60751",
            id: "http://data.ub.uio.no/humord/c60751",
            label: "Cornelia (Litterær karakter)",
          },
        ],
        error: undefined,
        authorityConfig,
      })
      expect(qaSearch.createLookupPromise).toHaveBeenCalledWith(
        "corn",
        authorityConfig,
        { startOfRange: 5 }
      )
    })
  })
})
