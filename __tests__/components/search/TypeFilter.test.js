import React from "react"
import TypeFilter from "components/search/TypeFilter"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import { createStore, renderComponent } from "testUtils"
import { createState } from "stateUtils"
import * as server from "sinopiaSearch"
import * as sinopiaApi from "sinopiaApi"

/* eslint-disable testing-library/no-node-access */
describe("<TypeFilter />", () => {
  const facetResults = {
    types: [
      {
        key: "http://id.loc.gov/ontologies/bibframe/Title",
        doc_count: 5,
      },
      {
        key: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
        doc_count: 4,
      },
      {
        key: "http://id.loc.gov/ontologies/bibframe/Barcode",
        doc_count: 1,
      },
      {
        key: "http://id.loc.gov/ontologies/bibframe/Chronology",
        doc_count: 1,
      },
    ],
  }

  jest.spyOn(sinopiaApi, "putUserHistory").mockResolvedValue()

  const createInitialState = () => {
    const state = createState()
    state.search.resource = {
      facetResults,
      query: "twain",
    }
    return state
  }

  it("does not render when no facet results", () => {
    renderComponent(<TypeFilter />)

    expect(screen.queryByText("Filter by class")).not.toBeInTheDocument()
  })

  it("renders when results", () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      undefined,
    ])

    const store = createStore(createInitialState())
    renderComponent(<TypeFilter />, store)

    screen.getByText("Filter by class")
    screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    screen.getByText("http://id.loc.gov/ontologies/bibframe/Chronology (1)")

    // Everything checked
    expect(document.querySelectorAll("input:checked")).toHaveLength(5)
  })

  it("allows changing filters by unselecting", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      undefined,
    ])

    const store = createStore(createInitialState())
    renderComponent(<TypeFilter />, store)

    expect(document.querySelector(".show")).not.toBeInTheDocument()
    fireEvent.click(screen.getByText("Filter by class"))
    expect(document.querySelector(".show")).toBeInTheDocument()
    fireEvent.click(
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    )

    // 3 checked with unselect (also clears Select/Deselect All)
    expect(document.querySelectorAll("input:checked")).toHaveLength(3)

    // Apply filter
    fireEvent.click(screen.getByText("Go"))

    await waitFor(() =>
      expect(document.querySelector(".show")).not.toBeInTheDocument()
    )

    expect(mockGetSearchResults).toHaveBeenCalledWith("twain", {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      typeFilter: [
        "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
        "http://id.loc.gov/ontologies/bibframe/Barcode",
        "http://id.loc.gov/ontologies/bibframe/Chronology",
      ],
    })
  })

  it("allows selecting / deselecting all", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      undefined,
    ])

    const store = createStore(createInitialState())
    renderComponent(<TypeFilter />, store)

    fireEvent.click(screen.getByText("Filter by class"))
    // Deselect all
    fireEvent.click(screen.getByText("Select/Deselect all"))

    // none checked
    expect(document.querySelectorAll("input:checked")).toHaveLength(0)

    // Select all
    fireEvent.click(screen.getByText("Select/Deselect all"))

    // all checked
    expect(document.querySelectorAll("input:checked")).toHaveLength(5)
  })

  it("allows clearing filters", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      facetResults,
    ])

    const store = createStore(createInitialState())
    renderComponent(<TypeFilter />, store)

    fireEvent.click(screen.getByText("Filter by class"))
    fireEvent.click(
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    )

    // 3 checked with clear (also clears Select/Deselect All)
    expect(document.querySelectorAll("input:checked")).toHaveLength(3)

    // Apply filter
    fireEvent.click(screen.getByText("Go"))

    await waitFor(() =>
      expect(document.querySelector(".show")).not.toBeInTheDocument()
    )

    fireEvent.click(screen.getByText("Filter by class"))
    fireEvent.click(screen.getByText("Clear filter"))

    expect(mockGetSearchResults).toHaveBeenLastCalledWith("twain", {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      typeFilter: null,
    })
  })

  it("allows reselecting cleared filters before using them", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      facetResults,
    ])

    const store = createStore(createInitialState())
    renderComponent(<TypeFilter />, store)

    fireEvent.click(screen.getByText("Filter by class"))
    // all checked
    expect(document.querySelectorAll("input:checked")).toHaveLength(5)

    // Deselect individual filter
    fireEvent.click(
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    )

    // 3 checked with deselect (also clears Select/Deselect All)
    expect(document.querySelectorAll("input:checked")).toHaveLength(3)

    // Reselect individual filter
    fireEvent.click(
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    )

    // all checked (includes Select/Deselect All)
    expect(document.querySelectorAll("input:checked")).toHaveLength(5)
  })
})
