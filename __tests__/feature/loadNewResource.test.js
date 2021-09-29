import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderApp } from "testUtils"
import { featureSetup } from "featureUtils"

featureSetup()

describe("loading new resource", () => {
  it("opens the resource", async () => {
    renderApp()

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
    fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))

    // The result
    await screen.findByText(/Uber template1/)
    screen.getByText("resourceTemplate:testing:uber1")
    screen.getByText("http://id.loc.gov/ontologies/bibframe/Uber1")
    screen.getAllByText("Justin Littman")
    screen.getByText("Jul 27, 2020")

    // Click the resource template
    fireEvent.click(screen.getByText("Uber template1", { selector: "a" }))
    await waitFor(() =>
      expect(
        screen.getAllByText("Uber template1", { selector: "h3" })
      ).toHaveLength(1)
    )

    // Not duplicating testing of rendering of resource template from loadResource test.

    // Defaults are displayed
    screen.getByText("Default literal1")
    screen.getByText("Default literal2")
    screen.getByText("Default URI1")
    screen.getByText("http://sinopia.io/defaultURI2")
    screen.getByText("Default required literal1")
    screen.getByText("Default required literal2")

    // Panel properties (i.e., root properties) are expanded.
    screen.getByPlaceholderText("Uber template1, property2")
    screen.getByPlaceholderText("Uber template1, property4")
    screen.getByPlaceholderText("Uber template1, property5")
    screen.getByPlaceholderText(
      "Enter lookup query for Uber template1, property15"
    )
    screen.getByPlaceholderText(
      "Enter lookup query for Uber template1, property16"
    )
    expect(
      screen.getAllByText("Uber template4", { selector: "h5" })
    ).toHaveLength(2)
    expect(
      screen.getAllByPlaceholderText("Uber template4, property1")
    ).toHaveLength(2)
    expect(
      screen.getAllByText("Uber template2", { selector: "h5" })
    ).toHaveLength(2)

    // Save button is disabled
    expect(
      screen.getAllByText("Save", { selector: "button" })[0]
    ).toBeDisabled()

    // Only current property's subproperties are expanded in the nav panel
    expect(
      screen.queryByText("Uber template2", { selector: ".left-nav-header" })
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Uber template3", { selector: ".left-nav-header" })
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Uber template4", { selector: ".left-nav-header" })
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId("Go to Uber template1, property19"))

    expect(
      await screen.findByText("Uber template4", {
        selector: ".left-nav-header",
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Uber template2", { selector: ".left-nav-header" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText("Uber template3", { selector: ".left-nav-header" })
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByText("Uber template1, property18", {
        selector: ".left-nav-header",
      })
    )

    expect(
      await screen.findByText("Uber template4", {
        selector: ".left-nav-header",
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Uber template2", { selector: ".left-nav-header" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText("Uber template3", { selector: ".left-nav-header" })
    ).not.toBeInTheDocument()
  }, 15000)
})
