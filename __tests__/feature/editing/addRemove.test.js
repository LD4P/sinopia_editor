import { renderApp, createHistory } from "testUtils"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

describe("adding and removing properties", () => {
  const history = createHistory(["/editor/resourceTemplate:testing:uber1"])

  it("adds and removes panel properties", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    // Remove panel property.
    fireEvent.click(screen.getByTestId("Remove Uber template1, property2"))

    // Input box removed.
    expect(
      screen.queryAllByPlaceholderText("Uber template1, property2")
    ).toHaveLength(0)
    // Add button displayed.
    screen.getByTestId("Add Uber template1, property2")
    // Remove button removed.
    expect(
      screen.queryAllByTestId("Remove Uber template1, property2")
    ).toHaveLength(0)

    // Now add it.
    expect(screen.getAllByText(/Uber template1, property2$/)).toHaveLength(2) // do not want to match property20!
    fireEvent.click(screen.getByTestId("Add Uber template1, property2"))

    // Input box displayed
    await screen.findByPlaceholderText("Uber template1, property2")
    // Add button removed.
    expect(
      screen.queryAllByTestId("Add Uber template1, property2")
    ).toHaveLength(0)
  }, 15000)

  it("adds and removes repeatable nested resources", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    expect(screen.queryAllByText("Uber template2")).toHaveLength(2)

    // Get rid of Uber template1, property3
    fireEvent.click(screen.getByTestId("Remove Uber template1, property3"))

    await screen.findByText("Uber template2", { selector: "h5" })
    await screen.findByText("Uber template3", { selector: "h5" })

    // Now remove
    expect(screen.queryAllByTestId("Remove Uber template2")).toHaveLength(0)
    // Add another Uber template2
    fireEvent.click(screen.getByTestId("Add another Uber template2"))

    // Two resource properties
    await waitFor(() =>
      expect(screen.queryAllByText("Uber template2")).toHaveLength(2)
    )
    // Two remove buttons
    const removeBtns = screen.queryAllByTestId("Remove Uber template2")
    expect(removeBtns).toHaveLength(2)
    // Add another still visible
    screen.getByTestId("Add another Uber template2")

    // Remove the first
    fireEvent.click(removeBtns[0])
    // One resource property
    await screen.findByText("Uber template2", { selector: "h5" })
    // No remove
    expect(screen.queryAllByTestId("Remove Uber template2")).toHaveLength(0)
    // Add another still visible
    screen.getByTestId("Add another Uber template2")
  }, 25000)

  it("adds and removes non-repeatable nested resources", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    // Remove Uber template1, property1 to not confuse this test
    // expect(screen.getAllByText('Uber template1, property3')).toHaveLength(2)
    fireEvent.click(screen.getByTestId("Remove Uber template1, property1"))

    await screen.findByText("Uber template2", { selector: "h5" })
    await screen.findByText("Uber template3", { selector: "h5" })

    // No remove
    expect(screen.queryAllByTestId("Remove Uber template2")).toHaveLength(0)
    // No add another
    expect(screen.queryAllByTestId("Add another Uber template2")).toHaveLength(
      0
    )
  }, 15000)

  it("adds and removes nested inputs", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    // Add a nested property (literal)
    fireEvent.click(screen.getAllByTestId("Add Uber template2, property1")[0])
    // Input box displayed
    await screen.findByPlaceholderText("Uber template2, property1")

    // Now remove it.
    fireEvent.click(screen.getByTestId("Remove Uber template2, property1"))

    // Input box removed.
    expect(
      screen.queryAllByPlaceholderText("Uber template2, property1")
    ).toHaveLength(0)
    // Delete button removed
    expect(
      screen.queryAllByTestId("Remove Uber template2, property1")
    ).toHaveLength(0)
  }, 15000)

  it("removes and adds a required property with defaults, leaving the defaults but deleting the user entered literal", async () => {
    renderApp(null, history)

    const literalText = "bogus in property 7"

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    // Verify defaults for propert7 are shown
    expect(screen.queryAllByText("Default literal1")).toHaveLength(1)
    expect(screen.queryAllByText("Default literal2")).toHaveLength(1)

    // Enter a new literal value
    fireEvent.click(screen.getByTestId("Add another Uber template1, property7"))
    const inputs = screen.queryAllByPlaceholderText("Uber template1, property7")
    expect(inputs).toHaveLength(3)
    const input = inputs[2]
    fireEvent.change(input, { target: { value: literalText } })

    // Now remove property7.
    fireEvent.click(screen.getByTestId("Remove Uber template1, property7"))

    // Verify defaults and bogus literal for propert7 are gone
    expect(screen.queryAllByText("Default literal1")).toHaveLength(0)
    expect(screen.queryAllByText("Default literal2")).toHaveLength(0)
    expect(screen.queryAllByText(literalText)).toHaveLength(0)

    // Remove button removed.
    expect(
      screen.queryAllByTestId("Remove Uber template1, property7")
    ).toHaveLength(0)

    // Now add back property7.
    fireEvent.click(screen.getByTestId("Add Uber template1, property7"))

    // Verify defaults for propert7 are back again but user entered literal is gone
    expect(screen.queryAllByText("Default literal1")).toHaveLength(1)
    expect(screen.queryAllByText("Default literal2")).toHaveLength(1)
    expect(screen.queryAllByText(literalText)).toHaveLength(0)
  }, 15000)
})
