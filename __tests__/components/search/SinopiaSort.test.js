import React from "react"
import SinopiaSort from "components/search/SinopiaSort"
import * as server from "sinopiaSearch"
import { fireEvent, screen } from "@testing-library/react"
import { createStore, renderComponent } from "testUtils"
import { createState } from "stateUtils"

describe("<SinopiaSort />", () => {
  it("renders with default", () => {
    renderComponent(<SinopiaSort />)
    screen.getByText("Sort by")
    screen.getByText("Label, ascending")
    expect(
      screen.queryByText("Label, ascending", { selector: ".active" })
    ).not.toBeInTheDocument()

    screen.getByText("Relevance", { selector: ".active" })
  })

  it("renders with selected sort order", () => {
    const state = createState()
    state.search.resource = {
      options: {
        sortField: "label",
        sortOrder: "asc",
      },
    }
    const store = createStore(state)
    renderComponent(<SinopiaSort />, store)

    screen.getByText("Label, ascending", { selector: ".active" })
  })

  it("clicking changes the sort order", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {
        totalHits: 1,
        results: [
          {
            uri: "resource/ca0d53d0-2b99-4f75-afb0-739a6f0af4f4",
            label: "The Real Mark Twain",
            title: ["The Real Mark Twain"],
          },
        ],
      },
    ])

    const state = createState()
    state.search.resource = {
      query: "twain",
      options: {
        startOfRange: 10,
        resultsPerPage: 15,
      },
    }

    const store = createStore(state)
    renderComponent(<SinopiaSort />, store)

    fireEvent.click(screen.getByText("Sort by"))
    fireEvent.click(screen.getByText("Label, ascending"))

    await screen.findByText("Label, ascending", { selector: ".active" })
    expect(server.getSearchResultsWithFacets).toHaveBeenCalledWith("twain", {
      startOfRange: 0,
      resultsPerPage: 15,
      sortField: "label",
      sortOrder: "asc",
    })
  })
})
