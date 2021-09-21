import React from "react"
import TypeFilter from "components/search/TypeFilter"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import { createStore, renderComponent } from "testUtils"
import { createState } from "stateUtils"
import * as server from "sinopiaSearch"
import * as sinopiaApi from "sinopiaApi"

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
    const { container } = renderComponent(<TypeFilter />, store)

    screen.getByText("Filter by class")
    screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    screen.getByText("http://id.loc.gov/ontologies/bibframe/Chronology (1)")

    // Everything checked
    expect(container.querySelectorAll("input:checked")).toHaveLength(4)
  })

  it("allows changing filters by unselecting", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      undefined,
    ])

    const store = createStore(createInitialState())
    const { container } = renderComponent(<TypeFilter />, store)

    expect(container.querySelector("div.show")).not.toBeInTheDocument()
    fireEvent.click(screen.getByText("Filter by class"))
    expect(container.querySelector("div.show")).toBeInTheDocument()
    fireEvent.click(
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    )

    // 3 checked
    expect(container.querySelectorAll("input:checked")).toHaveLength(3)

    // Apply filter
    fireEvent.click(screen.getByText("Go"))

    await waitFor(() =>
      expect(container.querySelector("div.show")).not.toBeInTheDocument()
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

  it("allows selecting only", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      undefined,
    ])

    const store = createStore(createInitialState())
    const { container } = renderComponent(<TypeFilter />, store)

    fireEvent.click(screen.getByText("Filter by class"))
    fireEvent.click(screen.getAllByText("Only")[0])

    // 3 checked
    expect(container.querySelectorAll("input:checked")).toHaveLength(1)

    // Apply filter
    fireEvent.click(screen.getByText("Go"))

    await waitFor(() =>
      expect(container.querySelector("div.show")).not.toBeInTheDocument()
    )

    expect(mockGetSearchResults).toHaveBeenCalledWith("twain", {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      typeFilter: ["http://id.loc.gov/ontologies/bibframe/Title"],
    })
  })

  it("allows clearing filters", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      facetResults,
    ])

    const store = createStore(createInitialState())
    const { container } = renderComponent(<TypeFilter />, store)

    fireEvent.click(screen.getByText("Filter by class"))
    fireEvent.click(
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Title (5)")
    )

    // 3 checked
    expect(container.querySelectorAll("input:checked")).toHaveLength(3)

    // Apply filter
    fireEvent.click(screen.getByText("Go"))

    await waitFor(() =>
      expect(container.querySelector("div.show")).not.toBeInTheDocument()
    )

    fireEvent.click(screen.getByText("Filter by class"))
    fireEvent.click(screen.getByText("Clear filter"))

    expect(mockGetSearchResults).toHaveBeenLastCalledWith("twain", {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      typeFilter: undefined,
    })
  })
})
