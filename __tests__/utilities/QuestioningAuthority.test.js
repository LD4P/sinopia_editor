// Copyright 2019 Stanford University see LICENSE for license
import { createLookupPromise, getTerm } from "utilities/QuestioningAuthority"
import { findAuthorityConfig } from "utilities/authorityConfig"

describe("createLookupPromise()", () => {
  const response = {
    ok: true,
    url: "https://lookup.ld4l.org/authorities/search/linked_data/agrovoc_ld4l_cache?q=Corn&maxRecords=8&lang=en&context=true&response_header=true&startRecord=1",
    status: 200,
    statusText: "OK",
    json: () => {
      return {
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
      }
    },
  }

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve(response))
  })

  describe("when authority with no subauthority", () => {
    it("returns a promise from a search", async () => {
      const authorityConfig = findAuthorityConfig("urn:ld4p:qa:agrovoc")
      const result = await createLookupPromise("Corn", authorityConfig)
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(response.url)
      expect(result.results).toHaveLength(8)
    })
  })

  describe("when authority with subauthority", () => {
    it("returns a promise from a search", async () => {
      const authorityConfig = findAuthorityConfig("urn:ld4p:qa:geonames:water")
      await createLookupPromise("Artic Sea", authorityConfig)
      expect(global.fetch).toHaveBeenCalledWith(
        "https://lookup.ld4l.org/authorities/search/linked_data/geonames_ld4l_cache/water?q=Artic+Sea&maxRecords=8&lang=en&context=true&response_header=true&startRecord=1"
      )
    })
  })

  describe("when non-LD authority and subauthority", () => {
    it("returns a promise from a search", async () => {
      const authorityConfig = findAuthorityConfig("urn:discogs:release")
      await createLookupPromise("twain", authorityConfig)
      expect(global.fetch).toHaveBeenCalledWith(
        "https://lookup.ld4l.org/authorities/search/discogs/release?q=twain&maxRecords=8&lang=en&context=true&response_header=true&startRecord=1"
      )
    })
  })

  describe("when no response header", () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          url: "https://lookup.ld4l.org/authorities/search/local/publisher_cities_select_list?q=new+york&maxRecords=8&lang=en&context=true&response_header=true&startRecord=1",
          status: 200,
          statusText: "OK",
          json: () => {
            return [
              {
                id: "http://id.loc.gov/authorities/names/n79007751",
                label: "New York (N.Y.)",
                uri: "http://id.loc.gov/authorities/names/n79007751",
              },
            ]
          },
        })
      )
    })

    it("adapts the response", async () => {
      const authorityConfig = findAuthorityConfig("urn:qa:publisherCities")
      const response = await createLookupPromise("New York", authorityConfig)
      expect(response.response_header.total_records).toBe(1)
      expect(response.results).toHaveLength(1)
    })
  })

  describe("when error response", () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Server error",
        })
      )
    })

    it("returns a promise from a search", async () => {
      const authorityConfig = findAuthorityConfig("urn:discogs")
      const response = await createLookupPromise("twain", authorityConfig)
      expect(response.isError).toBe(true)
      expect(response.errorObject.message).toEqual(
        "Questioning Authority service returned Server error"
      )
    })
  })

  describe("when fetch error", () => {
    beforeEach(() => {
      global.fetch = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error("Ooops.")))
    })

    it("returns a promise from a search", async () => {
      const authorityConfig = findAuthorityConfig("urn:discogs")
      const response = await createLookupPromise("twain", authorityConfig)
      expect(response.isError).toBe(true)
      expect(response.errorObject.message).toEqual("Ooops.")
    })
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
