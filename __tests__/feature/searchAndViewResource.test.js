import { fireEvent, screen } from "@testing-library/react"
import { renderApp } from "testUtils"
import * as sinopiaSearch from "sinopiaSearch"
import { resourceSearchResults } from "fixtureLoaderHelper"
import { featureSetup } from "featureUtils"

featureSetup()
jest.mock("sinopiaSearch")

describe("searching and viewing a resource", () => {
  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    results: [
      {
        id: "resourceTemplate:bf2:Title",
        uri: "http://localhost:3000/resource/resourceTemplate:bf2:Title",
        remark: "Title information relating to a resource",
        resourceLabel: "Instance Title",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Title",
      },
      {
        id: "resourceTemplate:bf2:Title:Note",
        uri: "http://localhost:3000/resource/resourceTemplate:bf2:Title:Note",
        remark: "Note about the title",
        resourceLabel: "Title note",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Note",
      },
    ],
    totalHits: 2,
    options: {
      startOfRange: 0,
      resultsPerPage: 10,
    },
  })

  // Setup search component to return known resource
  const uri =
    "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
  sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(
    resourceSearchResults(uri)
  )

  it("renders a modal without edit controls", async () => {
    renderApp()

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
    fireEvent.click(screen.getByText("Search", { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Query"), { target: { value: uri } })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    expect(
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Fixture")
    ).toBeInTheDocument()

    // Modal hasn't rendered yet
    expect(
      screen.queryByRole("dialog", { name: "View Resource" })
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
        selector: "label",
      })
    ).toHaveLength(1)

    // Edit controls are disabled in view modal
    screen
      .getAllByTestId("Remove Uber template3, property1")
      .forEach((removeButton) => {
        expect(removeButton).toBeDisabled()
      })
    screen.getAllByText("ä").forEach((languageButton) => {
      expect(languageButton).toBeDisabled()
    })
    expect(
      screen.getByPlaceholderText("Uber template3, property1")
    ).toBeDisabled()
    expect(screen.getByTestId("Edit Uber template3, property1")).toBeDisabled()
    expect(
      screen.getByTestId("Change language for Uber template3, property1")
    ).toBeDisabled()
    expect(screen.getByTestId("Remove analog")).toBeDisabled()
    screen.getAllByTestId(/Submit lookup/).forEach((lookupValueControl) => {
      expect(lookupValueControl).toBeDisabled()
    })
    screen.getAllByTestId("list").forEach((listControl) => {
      expect(listControl).toBeDisabled()
    })

    // Modal has edit and copy buttons
    expect(screen.getByTestId("edit-resource")).toBeInTheDocument()
    expect(screen.getByTestId("copy-resource")).toBeInTheDocument()

    // Edit button opens the editor with existing resource
    fireEvent.click(
      screen.getByLabelText("Edit", { selector: "button", exact: true })
    )
    expect(
      screen.getByText("Uber template1", { selector: "h3" })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Copy URI", { selector: "button" })
    ).toBeInTheDocument()

    // Make sure nav panel didn't disappear
    fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))
    fireEvent.click(await screen.findByText("Title note", { selector: "a" }))
    expect(
      await screen.findByTestId("Go to Note Text", { selector: "button" })
    ).toBeInTheDocument()

    // Switch back to search page
    fireEvent.click(screen.getByText("Search", { selector: "a" }))

    // Confirm search query is still in place (stored in state and not cleared)
    expect(await screen.getByLabelText("Query").value).toEqual(uri)

    // Clear search button empties the search field
    fireEvent.click(
      screen.getByTestId("Clear query string", { selector: "button" })
    )
    expect(await screen.getByLabelText("Query").value).toEqual("")
  }, 10000)
})
