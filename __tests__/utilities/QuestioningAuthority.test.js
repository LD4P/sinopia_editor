// Copyright 2019 Stanford University see LICENSE for license
import { createLookupPromise, getTerm } from "utilities/QuestioningAuthority"
import { findAuthorityConfig } from "utilities/authorityConfig"
import Swagger from "swagger-client"

jest.mock("swagger-client")

describe("createLookupPromise()", () => {
  it("returns a promise from a search", async () => {
    const response = {
      ok: true,
      url: "https://lookup.ld4l.org/authorities/search/linked_data/agrovoc_ld4l_cache?q=Corn&maxRecords=8&lang=en&context=true",
      status: 200,
      statusText: "OK",
      body: {
        response_header: {
          start_record: 1,
          requested_records: 8,
          retrieved_records: 8,
          total_records: 23,
        },
        results: [
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_331388",
            id: "http://aims.fao.org/aos/agrovoc/c_331388",
            label: "corn sheller",
          },
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_33224",
            id: "http://aims.fao.org/aos/agrovoc/c_33224",
            label: "Corn Belt (USA)",
          },
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_16171",
            id: "http://aims.fao.org/aos/agrovoc/c_16171",
            label: "corn cob mix",
          },
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_14385",
            id: "http://aims.fao.org/aos/agrovoc/c_14385",
            label: "soft corn",
          },
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_fd817c5d",
            id: "http://aims.fao.org/aos/agrovoc/c_fd817c5d",
            label: "southern leaf blight of maize",
          },
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_34f087cf",
            id: "http://aims.fao.org/aos/agrovoc/c_34f087cf",
            label: "maize gluten",
          },
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_d859f064",
            id: "http://aims.fao.org/aos/agrovoc/c_d859f064",
            label: "maize bran",
          },
          {
            uri: "http://aims.fao.org/aos/agrovoc/c_7552",
            id: "http://aims.fao.org/aos/agrovoc/c_7552",
            label: "sweet corn",
          },
        ],
      },
      authLabel: "AGROVOC (QA)",
      authURI: "urn:ld4p:qa:agrovoc",
      label: "AGROVOC (QA)",
      id: "urn:ld4p:qa:agrovoc",
    }

    const mockActionFunction = jest.fn().mockResolvedValue(response)
    const client = {
      apis: { SearchQuery: { GET_searchAuthority: mockActionFunction } },
    }
    Swagger.mockResolvedValue(client)

    const authorityConfig = findAuthorityConfig("urn:ld4p:qa:agrovoc")
    const result = await createLookupPromise("Corn", authorityConfig)
    expect(result.body.results.length).toEqual(8)
  })
})

describe("getTerm", () => {
  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ text: () => "n3" }))
  })

  it("fetches N3 from QA with uri", async () => {
    const term = await getTerm(
      "http://share-vde.org/sharevde/rdfBibframe/Work/4840195",
      undefined,
      "urn:ld4p:qa:sharevde_chicago_ld4l_cache:all"
    )
    expect(term).toBe("n3")

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const url =
      "https://lookup.ld4l.org/authorities/fetch/linked_data/sharevde_chicago_ld4l_cache?format=n3&uri=http://share-vde.org/sharevde/rdfBibframe/Work/4840195"
    expect(global.fetch).toHaveBeenCalledWith(url)
  })
  it("fetches N3 from QA with id", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ text: () => "n3" }))

    const term = await getTerm(
      "https://www.discogs.com/Shania-Twain-Shania-Twain/master/132553",
      "132553",
      "urn:discogs:master"
    )
    expect(term).toBe("n3")

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const url =
      "https://lookup.ld4l.org/authorities/show/discogs/master/132553?format=n3"
    expect(global.fetch).toHaveBeenCalledWith(url)
  })
})
