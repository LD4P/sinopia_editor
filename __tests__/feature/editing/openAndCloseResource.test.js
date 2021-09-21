import { renderApp, createHistory, createStore } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { featureSetup } from "featureUtils"

featureSetup()

const history = createHistory([
  "/editor/ld4p:RT:bf2:Title:AbbrTitle",
  "/editor/ld4p:RT:bf2:Note",
])

describe("switching between multiple resources", () => {
  const state = createState({ hasTwoLiteralResources: true })
  const store = createStore(state)

  it("has a resource loaded into state", async () => {
    renderApp(store, history)

    await screen.findByText("Abbreviated Title", { selector: "h3" })
    await screen.findByText("Abbreviated Title", {
      selector: ".nav-item.active .nav-link",
    })

    // It does not have the the 'template' class for header color
    const templateClass = screen.queryAllByTestId("template")
    expect(templateClass.length).toEqual(0)
  })

  it("has a second resource shown as the inactive button tab", async () => {
    renderApp(store, history)

    await screen.findByText("Note", {
      selector: ".nav-item:not(.active) .nav-link",
    })
  })

  it("switches between the active and inactive resources", async () => {
    renderApp(store, history)

    // Click the inactive tab
    const noteTab = await screen.findByText("Note", { selector: ".nav-link" })
    fireEvent.click(noteTab)

    // Note is now the active resource and Abbreviated Title is now the inactive resource
    await screen.findByText("Note", { selector: "h3" })
    await screen.findByText("Abbreviated Title", {
      selector: ".nav-item:not(.active) .nav-link",
    })

    // It does not have the the 'template' class for header color
    const templateClass = screen.queryAllByTestId("template")
    expect(templateClass.length).toEqual(0)
  })
})

describe("closing the resources", () => {
  const state = createState({ hasTwoLiteralResources: true })
  const store = createStore(state)

  it("removes the navigation tabs and the resources from view", async () => {
    renderApp(store, history)

    const abbreviatedTitleTab = screen.getByText("Abbreviated Title", {
      selector: ".nav-link",
    })
    const noteTab = await screen.findByText("Note", { selector: ".nav-link" })

    // Closing the active tab will reveal the inactive resource as the one shown
    const closeBtn = screen.getAllByText("Close", { selector: "button" })
    fireEvent.click(closeBtn[0])
    await screen.findByText("Note", { selector: "h3" })

    // // without any navigation tabs
    expect(abbreviatedTitleTab).not.toBeInTheDocument()
    expect(noteTab).not.toBeInTheDocument()

    // Closing the only shown resource will direct to the resource templates page
    fireEvent.click(closeBtn[0])
    const resourceTemplatesTab = await screen.findByText("Resource Templates", {
      selector: "a",
    })
    expect(resourceTemplatesTab).toHaveClass("active")
  })
})
