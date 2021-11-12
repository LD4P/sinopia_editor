import { renderApp, createHistory, createStore } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaSearch from "sinopiaSearch"
import { featureSetup } from "featureUtils"

featureSetup()
jest.mock("sinopiaSearch")

describe("Copying a template resource", () => {
  const history = createHistory(["/templates"])
  const store = createStore()

  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    results: [
      {
        id: "resourceTemplate:bf2:Note",
        author: null,
        date: null,
        remark: null,
        resourceLabel: "Note",
        resourceURI: "http://sinopia.io/vocabulary/ResourceTemplate",
        uri: "http://localhost:3000/resource/resourceTemplate:bf2:Note",
      },
    ],
    totalHits: 1,
    options: {
      startOfRange: 0,
      resultsPerPage: 10,
    },
  })

  it("clicks on the copy button", async () => {
    renderApp(store, history)

    // Search for the template resource
    const input = screen.getByPlaceholderText(
      "Enter id, label, URI, remark, group, or author"
    )
    await fireEvent.change(input, { target: { value: "note" } })
    await screen.findByText("resourceTemplate:bf2:Note")

    // Open the template
    fireEvent.click(await screen.findByTestId("Copy Note"))

    // Headers and labels appear
    await screen.findByText("Note", { selector: "h3#resource-header" })
    const labels = await screen.findAllByText("Note")
    expect(labels.length).toBe(4)

    // But there is no resource URI for the unsaved copy
    expect(screen.queryByText(/URI for this resource/)).not.toBeInTheDocument()

    const saveBtn = await screen.findAllByRole("button", { name: "Save" })
    expect(saveBtn[0]).not.toBeDisabled()

    // It has the 'template' class for header color
    const templateClasses = screen.getAllByTestId("template")
    expect(templateClasses.length).toEqual(9)
  })
})
