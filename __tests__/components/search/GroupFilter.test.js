import React from "react"
import GroupFilter from "components/search/GroupFilter"
import { createStore, renderComponent } from "testUtils"
import { createState } from "stateUtils"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import * as server from "sinopiaSearch"
import * as sinopiaApi from "sinopiaApi"

/* eslint-disable testing-library/no-node-access */
describe("<GroupFilter />", () => {
  const facetResults = {
    groups: [
      {
        key: "stanford",
        doc_count: 5,
      },
      {
        key: "cornell",
        doc_count: 4,
      },
      {
        key: "yale",
        doc_count: 1,
      },
      {
        key: "princeton",
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
    renderComponent(<GroupFilter />)

    expect(screen.queryByText("Filter by group")).not.toBeInTheDocument()
  })

  it("renders when results", () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      undefined,
    ])

    const store = createStore(createInitialState())
    renderComponent(<GroupFilter />, store)

    expect(screen.getByText("Filter by group")).toBeInTheDocument()
    expect(screen.getByText("Stanford University (5)")).toBeInTheDocument()
    expect(screen.getByText("Princeton University (1)")).toBeInTheDocument()

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
    renderComponent(<GroupFilter />, store)

    expect(document.querySelector(".show")).not.toBeInTheDocument()
    fireEvent.click(screen.getByText("Filter by group"))
    expect(document.querySelector(".show")).toBeInTheDocument()
    fireEvent.click(screen.getByText("Stanford University (5)"))

    // 3 checked with unselect (also clears Select/Deselect All)
    expect(document.querySelectorAll("input:checked").length).toBe(3)

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
      groupFilter: ["cornell", "yale", "princeton"],
    })
  })

  it("allows selecting / deselecting all", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      undefined,
    ])

    const store = createStore(createInitialState())
    renderComponent(<GroupFilter />, store)

    fireEvent.click(screen.getByText("Filter by group"))
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
    renderComponent(<GroupFilter />, store)
    fireEvent.click(screen.getByText("Filter by group"))
    fireEvent.click(screen.getByText("Stanford University (5)"))

    // 3 checked with deselect (also clears Select/Deselect All)
    expect(document.querySelectorAll("input:checked").length).toBe(3)

    // Apply filter
    fireEvent.click(screen.getByText("Go"))

    await waitFor(() =>
      expect(document.querySelector(".show")).not.toBeInTheDocument()
    )

    fireEvent.click(screen.getByText("Filter by group"))
    fireEvent.click(screen.getByText("Clear filter"))

    expect(mockGetSearchResults).toHaveBeenLastCalledWith("twain", {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      groupFilter: null,
    })
  })

  it("allows reselecting cleared filters before using them", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {},
      facetResults,
    ])

    const store = createStore(createInitialState())
    renderComponent(<GroupFilter />, store)

    fireEvent.click(screen.getByText("Filter by group"))
    // all checked
    expect(document.querySelectorAll("input:checked")).toHaveLength(5)

    // Deselect individual filter
    fireEvent.click(screen.getByText("Stanford University (5)"))

    // 3 checked with deselect (also clears Select/Deselect All)
    expect(document.querySelectorAll("input:checked")).toHaveLength(3)

    // Reselect individual filter
    fireEvent.click(screen.getByText("Stanford University (5)"))

    // all checked (includes Select/Deselect All)
    expect(document.querySelectorAll("input:checked")).toHaveLength(5)
  })
})
