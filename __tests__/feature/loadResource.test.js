import { renderApp } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaSearch from "sinopiaSearch"
import { resourceSearchResults } from "fixtureLoaderHelper"
import { featureSetup } from "featureUtils"

featureSetup()
jest.mock("sinopiaSearch")

describe("loading saved resource", () => {
  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    totalHits: 0,
    results: [],
    error: undefined,
  })

  describe("when RDF", () => {
    it("opens the resource", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
      sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(
        resourceSearchResults(uri)
      )

      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      // The result
      await screen.findByText(uri)
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Fixture")
      screen.getByText("Stanford University")
      screen.getByText("Jul 15, 2020")

      // Click edit
      fireEvent.click(screen.getByTestId(`Edit ${uri}`))
      await screen.findByText("Example Label", {
        selector: "h3#resource-header",
      })

      // URI displayed
      screen.getAllByText(`URI for this resource: <${uri}>`)

      // Headings
      screen.getByText("Example Label", { selector: "h3#resource-header" })
      screen.getByText("Uber template1, property1", { selector: "span" })
      screen.getAllByText("Uber template2", { selector: "h5" })
      screen.getAllByText("Uber template3", { selector: "h5" })
      // Length is the heading and the value.
      expect(screen.getAllByText("Uber template3, property1")).toHaveLength(2)
      expect(screen.getAllByText("Uber template3, property2")).toHaveLength(1)
      expect(screen.getAllByText("Uber template1, property2")).toHaveLength(3)
      // Heading appears twice, value once.
      expect(screen.getAllByText("Uber template2, property1")).toHaveLength(3)

      // Show input components
      screen.getByTestId("Hide Uber template3, property1")
      screen.getByTestId("Hide Uber template3, property2")
      expect(
        screen.getAllByTestId("Hide Uber template2, property1")
      ).toHaveLength(2)
      screen.getByPlaceholderText("Uber template3, property1")
      expect(
        screen.getAllByPlaceholderText("Uber template3, property2")
      ).toHaveLength(2)
      screen.getByPlaceholderText("Uber template1, property2")

      // confirm that the input field has an accessible label
      screen.getByLabelText("Uber template3, property1", {
        selector: "textarea",
      })

      // TODO: would expect this to work too, but it doesn't seem to, either in Firefox or in this test suite.
      // see https://github.com/LD4P/sinopia_editor/issues/2683
      // screen.getByLabelText('Uber template1, property1')
    })
  })

  describe("when invalid resource template", () => {
    it("displays error", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid"
      sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(
        resourceSearchResults(uri)
      )

      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      // The result
      await screen.findByText(uri)
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Fixture")
      screen.getByText("Stanford University")
      screen.getByText("Jul 15, 2020")

      // Click edit
      fireEvent.click(screen.getByTestId(`Edit ${uri}`))

      // Error displayed and remain on search page.
      await screen.findByText(/Repeated property templates/)
    })
  })
})
