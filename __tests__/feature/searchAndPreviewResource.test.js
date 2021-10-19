import { fireEvent, screen } from "@testing-library/react"
import { renderApp } from "testUtils"
import * as sinopiaSearch from "sinopiaSearch"
import { resourceSearchResults } from "fixtureLoaderHelper"
import { featureSetup } from "featureUtils"

jest.mock("sinopiaSearch")
featureSetup()

describe("searching and preview a resource", () => {
  describe("for a resource that is not a BF:instance", () => {
    // Setup search component to return known resource
    const uri = "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
    sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(resourceSearchResults(uri))

    it("renders a modal without edit controls", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      await screen.findByText(uri)
      expect(screen.getByText("http://id.loc.gov/ontologies/bibframe/Fixture")).toBeInTheDocument()

      // Modal hasn't rendered yet
      expect(screen.queryByRole("dialog", { name: "Preview Resource" })).not.toBeInTheDocument()
      expect(screen.getByTestId("view-resource-modal").classList).not.toContain("show")

      // Click the view icon next to the search result row
      expect(screen.getByTestId(`View ${uri}`)).toBeInTheDocument()
      fireEvent.click(screen.getByTestId(`View ${uri}`))

      // Modal has now rendered
      expect((await screen.findByTestId("view-resource-modal")).classList).toContain("show")
      expect(
        await screen.findAllByText("Uber template1, property1", {
          selector: "label",
        })
      ).toHaveLength(1)

      // Literals are rendered
      screen.findByText("Uber template3, property2, value1 [English]", {
        selector: "p",
      })
      screen.findByText("Uber template3, property2, value2 [English]", {
        selector: "p",
      })

      // Only properties with values are displayed.
      screen.getByText("Uber template1, property9")
      expect(screen.queryByText("Uber template1, property7")).not.toBeInTheDocument()

      // URIs are rendered.
      screen.getByText(/ubertemplate1:property5 \[English\]:/, {
        selector: "p",
      })
      screen.getByText("http://example.edu/ubertemplate1:property5", {
        selector: "a",
      })
      screen.getByText("ubertemplate1:property6: ubertemplate1:property6", {
        selector: "p",
      })

      // Lookups are rendered
      screen.getByText("corn sheller:", { selector: "p" })
      screen.getByText("http://aims.fao.org/aos/agrovoc/c_331388", {
        selector: "a",
      })

      // Lists are rendered
      screen.getByText("analog:", { selector: "p" })
      screen.getByText("http://id.loc.gov/vocabulary/mrectype/analog", {
        selector: "a",
      })

      // Switch to turtle
      fireEvent.change(screen.getByLabelText(/Format/), {
        target: { value: "turtle" },
      })
      await screen.findByText(
        /<http:\/\/sinopia.io\/vocabulary\/hasResourceTemplate> "resourceTemplate:testing:uber1";/
      )

      // Modal has edit and copy buttons
      expect(screen.getByTestId("edit-resource")).toBeInTheDocument()
      expect(screen.getByTestId("copy-resource")).toBeInTheDocument()

      // But on MARC and Export buttons
      expect(screen.queryByText("Request MARC", { selector: "button" })).not.toBeInTheDocument()
      expect(screen.queryByText(/Export to/, { selector: "button" })).not.toBeInTheDocument()

      // Edit button opens the editor with existing resource
      fireEvent.click(screen.getByLabelText("Edit", { selector: "button", exact: true }))
      expect(screen.getByText("Example Label", { selector: "h3" })).toBeInTheDocument()
      expect(screen.getByText("Copy URI", { selector: "button" })).toBeInTheDocument()

      // Make sure nav panel didn't disappear
      fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))
      fireEvent.click(await screen.findByTitle("Create resource for Title note"))
      expect(await screen.findByTestId("Go to Note Text", { selector: "button" })).toBeInTheDocument()

      // Confirm search query is still in place (stored in state and not cleared)
      expect(await screen.getByLabelText("Search").value).toEqual(uri)
    }, 10000)
  })

  describe("for a resource that is a BF:instance", () => {
    // Setup search component to return known resource
    const uri = "http://localhost:3000/resource/9c5bd9f5-1804-45bd-99ed-b6e3774c896e"
    sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(resourceSearchResults(uri))

    it.only("renders a modal without edit controls but with MARC button and Export button", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      await screen.findByText(uri)
      expect(screen.getByText("http://id.loc.gov/ontologies/bibframe/Fixture")).toBeInTheDocument()

      // Modal hasn't rendered yet
      expect(screen.queryByRole("dialog", { name: "Preview Resource" })).not.toBeInTheDocument()
      expect(screen.getByTestId("view-resource-modal").classList).not.toContain("show")

      // Click the view icon next to the search result row
      expect(screen.getByTestId(`View ${uri}`)).toBeInTheDocument()
      fireEvent.click(screen.getByTestId(`View ${uri}`))

      // Modal has now rendered
      expect((await screen.findByTestId("view-resource-modal")).classList).toContain("show")
      expect(
        await screen.findAllByText("Note", {
          selector: "label",
        })
      ).toHaveLength(1)

      screen.getByText("Request MARC", { selector: "button" })
      screen.getByText(/Export to/, { selector: "button" })
    }, 10000)
  })
})
