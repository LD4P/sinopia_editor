import { fireEvent, screen } from "@testing-library/react"
import { renderApp } from "testUtils"
import { featureSetup, resourceHeaderSelector } from "featureUtils"
import { resourceSearchResults } from "fixtureLoaderHelper"
import * as sinopiaSearch from "sinopiaSearch"

featureSetup()

describe("viewing the dashboard", () => {
  describe("before user interacts with Sinopia", () => {
    it("displays a welcome message", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      screen.getByText(/Welcome to Sinopia/)
    })
  }, 10000)

  describe("when user uses a source template", () => {
    it("lists the resource template", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))

      // The result
      await screen.findByText(/Uber template1/)

      // Click the resource template
      fireEvent.click(screen.getByTestId("Create resource for Uber template1"))
      await screen.findByText("Uber template1", {
        selector: resourceHeaderSelector,
      })

      fireEvent.click(screen.getByText("Dashboard", { selector: "a" }))

      expect(screen.queryByText(/Welcome to Sinopia/)).not.toBeInTheDocument()

      screen.getByText("Recent templates")

      // The result
      screen.getByText(/Uber template1/)
      screen.getByText("resourceTemplate:testing:uber1")
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Uber1")
      screen.getAllByText("Justin Littman")
      screen.getByText("Jul 27, 2020")
    })
  }, 10000)

  describe("when user performs a search", () => {
    it("lists the search and allows performing search", async () => {
      const noResult = {
        took: 8,
        timed_out: false,
        _shards: {
          total: 5,
          successful: 5,
          skipped: 0,
          failed: 0,
        },
        hits: {
          total: { value: 0 },
          max_score: 0,
          hits: [],
        },
      }
      global.fetch = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ json: () => noResult }))

      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: "asdfqwerty" },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      await screen.findByText(/Displaying 0 Search Results/)

      fireEvent.click(screen.getByText("Dashboard", { selector: "a" }))

      screen.getByText("Recent searches")

      // The result
      screen.getByText("Sinopia resources")
      screen.getByText("asdfqwerty")
    })
  }, 10000)

  describe("when user uses a resource", () => {
    it("lists the resource", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
      sinopiaSearch.getSearchResultsWithFacets = jest
        .fn()
        .mockResolvedValue(resourceSearchResults(uri))

      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      // The result
      await screen.findByText(uri)

      // Click edit
      fireEvent.click(screen.getByTestId(`Edit ${uri}`))
      await screen.findByText("Example Label", {
        selector: resourceHeaderSelector,
      })

      fireEvent.click(screen.getByText("Dashboard", { selector: "a" }))

      screen.getByText("Recent resources")

      // The result
      screen.getByText(
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
        { selector: "table.resource-list td" }
      )
    })
  }, 10000)
})
