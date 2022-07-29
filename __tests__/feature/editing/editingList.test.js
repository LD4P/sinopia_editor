import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

describe("editing a list property", () => {
  const history = createHistory(["/editor/resourceTemplate:testing:uber1"])

  it("allows selecting and removing a non-repeatable list item", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    // Authorities list
    expect(screen.getAllByText("Select from: type of recording")).toHaveLength(
      2
    )

    // No add another
    expect(
      screen.queryByTestId("Add another Uber template1, property10")
    ).not.toBeInTheDocument()

    const select = screen.getByTestId("Select Uber template1, property10")
    fireEvent.change(select, {
      target: { value: "http://id.loc.gov/vocabulary/mrectype/analog" },
    })

    expect(
      screen.getByText("http://id.loc.gov/vocabulary/mrectype/analog")
    ).toHaveClass("form-control")
    screen.getByText("analog", { selector: ".form-control" })

    // No select
    expect(select).not.toBeInTheDocument()

    // Now remove it
    fireEvent.click(
      screen.getByTestId("Remove http://id.loc.gov/vocabulary/mrectype/analog")
    )

    // Value removed
    await waitFor(() =>
      expect(
        screen.queryByText("http://id.loc.gov/vocabulary/mrectype/analog", {
          selector: ".form-control",
        })
      ).not.toBeInTheDocument()
    )

    // Blank lookup
    expect(screen.getByTestId("Select Uber template1, property10")).toHaveValue(
      "default"
    )
  }, 15000)

  it("allows entering a repeatable list", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    const select = screen.getByTestId("Select Uber template1, property11")
    fireEvent.change(select, {
      target: { value: "http://id.loc.gov/vocabulary/mrectype/analog" },
    })

    expect(
      screen.getByText("http://id.loc.gov/vocabulary/mrectype/analog")
    ).toHaveClass("form-control")

    fireEvent.click(
      screen.getByTestId("Add another Uber template1, property11")
    )

    const select2 = screen.getByTestId("Select Uber template1, property11")
    fireEvent.change(select2, {
      target: { value: "http://id.loc.gov/vocabulary/mrectype/digital" },
    })

    expect(
      screen.getByText("http://id.loc.gov/vocabulary/mrectype/digital")
    ).toHaveClass("form-control")
  }, 10000)

  it("displays items from multiple authorities", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    const select = screen.getByTestId("Select Uber template1, property12")
    within(select).getByText("analog")
    within(select).getByText("magnetic")
  }, 10000)
})
