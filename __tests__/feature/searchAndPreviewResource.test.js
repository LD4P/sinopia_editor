import { fireEvent, screen } from "@testing-library/react"
import { renderApp } from "testUtils"
import * as sinopiaSearch from "sinopiaSearch"
import { resourceSearchResults } from "fixtureLoaderHelper"
import { featureSetup } from "featureUtils"

featureSetup()

describe("searching and preview a resource", () => {
  describe("for a resource that is not a BF:instance", () => {
    const uri =
      "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
    beforeEach(() => {
      // Setup search component to return known resource
      jest
        .spyOn(sinopiaSearch, "getSearchResultsWithFacets")
        .mockResolvedValue(resourceSearchResults(uri))
    })

    it("renders a modal without edit controls", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      await screen.findByText(uri)
      expect(
        screen.getByText("http://id.loc.gov/ontologies/bibframe/Fixture")
      ).toBeInTheDocument()

      // Relationships toggle not shown since not VF
      expect(
        screen.queryByTestId(`Show relationships for ${uri}`)
      ).not.toBeInTheDocument()

      // Modal hasn't rendered yet
      expect(
        screen.queryByRole("dialog", { name: "Preview Resource" })
      ).not.toBeInTheDocument()
      expect(screen.getByTestId("view-resource-modal").classList).not.toContain(
        "show"
      )

      // Click the view icon next to the search result row
      expect(screen.getByTestId(`View ${uri}`)).toBeInTheDocument()
      fireEvent.click(screen.getByTestId(`View ${uri}`))

      // Modal has now rendered
      expect(await screen.findByTestId("view-resource-modal")).toHaveClass(
        "show"
      )
      screen.getByText("Uber template1, property1", {
        selector: "h5 span",
      })

      // Literals are rendered
      screen.getByText("Uber template3, property2, value1 [en]", {
        selector: "p",
      })
      screen.getByText("Uber template3, property2, value2 [en]", {
        selector: "p",
      })

      // Only properties with values are displayed.
      screen.getByText("Uber template1, property9")
      expect(
        screen.queryByText("Uber template1, property7")
      ).not.toBeInTheDocument()

      // URIs are rendered.
      screen.getByText(/ubertemplate1:property5 \[en\]:/, {
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
      screen.getByTestId("Edit Example Label")
      screen.getByTestId("Copy Example Label")

      // But no MARC and Export buttons
      expect(
        screen.queryByText("Request MARC", { selector: "button" })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText(/Export to/, { selector: "button" })
      ).not.toBeInTheDocument()

      // Edit button opens the editor with existing resource
      fireEvent.click(
        screen.getByTestId("Edit Example Label", { selector: "button" })
      )
      await screen.findByText("Example Label", {
        selector: "h3#resource-header",
      })

      // Make sure nav panel didn't disappear
      fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))
      fireEvent.click(
        await screen.findByTestId("Create resource for Title note")
      )
      await screen.findByTestId("Go to Note Text", { selector: "button" })

      // Confirm search query is still in place (stored in state and not cleared)
      expect(await screen.getByLabelText("Search").value).toEqual(uri)
    }, 10000)
  })

  describe("for a resource that does not have every value set", () => {
    // Setup search component to return known resource
    const uri =
      "http://localhost:3000/resource/a4181509-8046-47c8-9327-6e576c517d70"

    beforeEach(() => {
      // Setup search component to return known resource
      jest
        .spyOn(sinopiaSearch, "getSearchResultsWithFacets")
        .mockResolvedValue(resourceSearchResults(uri))
    })

    it("renders a modal without the empty resource and properties", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      await screen.findByText(uri)

      // Modal hasn't rendered yet
      expect(
        screen.queryByRole("dialog", { name: "Preview Resource" })
      ).not.toBeInTheDocument()
      expect(screen.getByTestId("view-resource-modal").classList).not.toContain(
        "show"
      )

      // Click the view icon next to the search result row
      expect(screen.getByTestId(`View ${uri}`)).toBeInTheDocument()
      fireEvent.click(screen.getByTestId(`View ${uri}`))

      // Modal has now rendered
      expect(
        (await screen.findByTestId("view-resource-modal")).classList
      ).toContain("show")
      expect(
        await screen.findAllByText("Uber template1, property1", {
          selector: "h5 span",
        })
      ).toHaveLength(1)

      // Nested resource is suppressed
      expect(screen.queryByText("Uber template2")).not.toBeInTheDocument()

      // Empty value is suppressed
      expect(
        await screen.queryByText("Uber template1, property2")
      ).not.toBeInTheDocument()
    }, 10000)
  })

  describe("for a resource that is a BF:instance", () => {
    const uri =
      "http://localhost:3000/resource/a5c5f4c0-e7cd-4ca5-a20f-2a37fe1080d5"
    beforeEach(() => {
      // Setup search component to return known resource
      jest
        .spyOn(sinopiaSearch, "getSearchResultsWithFacets")
        .mockResolvedValue(resourceSearchResults(uri))

      jest.spyOn(sinopiaSearch, "getSearchResultsByUris").mockResolvedValue({
        totalHits: 1,
        results: [
          {
            uri: "http://localhost:3000/resource/f6ee6410-5206-492b-8e48-3b6333010c33",
            label: "Work1",
            modified: "2021-10-30T18:06:01.265Z",
            type: ["http://id.loc.gov/ontologies/bibframe/Work"],
            group: "stanford",
            editGroups: [],
          },
        ],
      })
    })

    it("renders a modal without edit controls but with MARC button and Export button", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      await screen.findByText(uri)
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Fixture")

      // Modal hasn't rendered yet
      expect(
        screen.queryByRole("dialog", { name: "Preview Resource" })
      ).not.toBeInTheDocument()
      expect(screen.getByTestId("view-resource-modal").classList).not.toContain(
        "show"
      )

      // Click the view icon next to the search result row
      fireEvent.click(screen.getByTestId(`View ${uri}`))

      // Modal has now rendered
      expect(await screen.findByTestId("view-resource-modal")).toHaveClass(
        "show"
      )
      expect(
        await screen.findAllByText("Note", {
          selector: "span",
        })
      ).toHaveLength(1)

      screen.getByText("Request MARC", { selector: "button" })
      screen.getByText(/Export to/, { selector: "button" })

      // Switch to relationships
      fireEvent.change(screen.getByLabelText(/Format/), {
        target: { value: "relationships" },
      })
      await screen.findByText("Works", { selector: "h5" })
      screen.getByText("Work1", { selector: "li" })
    }, 10000)
  })
})
