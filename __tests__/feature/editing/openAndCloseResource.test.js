import { renderApp, createHistory, createStore } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { featureSetup } from "featureUtils"
import * as sinopiaSearch from "sinopiaSearch"

featureSetup()
jest.mock("sinopiaSearch")

describe("switching between multiple resources", () => {
  const history = createHistory(["/templates"])
  const state = createState()
  const store = createStore(state)

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

  it("switches between the active and inactive resources and closes resources", async () => {
    renderApp(store, history)

    fireEvent.change(screen.getByPlaceholderText(/Enter id, label/), {
      target: { value: "title" },
    })
    await screen.findByText("resourceTemplate:bf2:Title:Note")

    // open the template
    fireEvent.click(await screen.findByTestId("Create resource for Title note"))
    await screen.findByText("Title note", { selector: "h3#resource-header" })

    // Open another template
    fireEvent.click(
      await screen.findByText("Resource Templates", {
        selector: "a",
      })
    )

    fireEvent.click(
      await screen.findByTestId("Create resource for Instance Title")
    )
    await screen.findByText("Instance Title", {
      selector: "h3#resource-header",
    })

    // Instance title tab is active
    const instanceTitleTab = screen.getByText("Instance Title", {
      selector: ".nav-item.active .tab-link",
    })

    // Title note tab is inactive
    const titleNoteTab = screen.getByText("Title note", {
      selector: ".nav-item:not(.active) .tab-link",
    })

    // It does not have the the 'template' class for header color
    const templateClass = screen.queryAllByTestId("template")
    expect(templateClass.length).toEqual(0)

    // Click Title note tab
    fireEvent.click(titleNoteTab)

    // Title note is now the active resource and Instance Title is now the inactive resource
    await screen.findByText("Title note", { selector: "h3#resource-header" })
    await screen.findByText("Instance Title", {
      selector: ".nav-item:not(.active) .tab-link",
    })

    // Closing the active tab will reveal the inactive resource as the one shown
    fireEvent.click(screen.getAllByText("Close", { selector: "button" })[0])
    await screen.findByText("Instance Title", {
      selector: "h3#resource-header",
    })

    // No nav tabs displayed
    expect(instanceTitleTab).not.toBeInTheDocument()
    expect(titleNoteTab).not.toBeInTheDocument()

    // Closing the only shown resource will direct to the resource templates page
    fireEvent.click(screen.getAllByText("Close", { selector: "button" })[0])
    expect(
      await screen.findByText("Dashboard", {
        selector: "a",
      })
    ).toHaveClass("active")
  }, 15000)
})
