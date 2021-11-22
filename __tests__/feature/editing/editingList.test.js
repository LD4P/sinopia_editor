import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("editing a list property", () => {
  const history = createHistory(["/editor/resourceTemplate:testing:uber1"])

  it("allows selecting and removing a non-repeatable list item", async () => {
    const { container } = renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Authorities list
    expect(screen.getAllByText("Select from: type of recording")).toHaveLength(
      2
    )

    // No add another
    expect(
      screen.queryByTestId("Add another Uber template1, property10")
    ).not.toBeInTheDocument()

    const select = container.querySelector(
      'select[aria-label="Select Uber template1, property10"]'
    )
    expect(select).toBeInTheDocument()
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
    expect(
      container.querySelector(
        'select[aria-label="Select Uber template1, property10"]'
      )
    ).toHaveValue("default")
  }, 15000)

  it("allows entering a repeatable list", async () => {
    const { container } = renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    const select = container.querySelector(
      'select[aria-label="Select Uber template1, property11"]'
    )
    expect(select).toBeInTheDocument()
    fireEvent.change(select, {
      target: { value: "http://id.loc.gov/vocabulary/mrectype/analog" },
    })

    expect(
      screen.getByText("http://id.loc.gov/vocabulary/mrectype/analog")
    ).toHaveClass("form-control")

    fireEvent.click(
      screen.getByTestId("Add another Uber template1, property11")
    )

    const select2 = container.querySelector(
      'select[aria-label="Select Uber template1, property11"]'
    )
    expect(select2).toBeInTheDocument()
    fireEvent.change(select2, {
      target: { value: "http://id.loc.gov/vocabulary/mrectype/digital" },
    })

    expect(
      screen.getByText("http://id.loc.gov/vocabulary/mrectype/digital")
    ).toHaveClass("form-control")
  }, 10000)

  it("displays items from multiple authorities", async () => {
    const { container } = renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    expect(
      container.querySelector(
        'div[data-label="Uber template1, property12"] option[value="http://id.loc.gov/vocabulary/mrectype/analog"]'
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(
        'div[data-label="Uber template1, property12"] option[value="http://id.loc.gov/vocabulary/mrecmedium/mag"]'
      )
    ).toBeInTheDocument()
  }, 10000)
})
