import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("expanding and contracting properties", () => {
  it("shows and hides nested properties", async () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uber1"])
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Get rid of Uber template1, property3
    fireEvent.click(screen.getByTestId("Remove Uber template1, property3"))

    await screen.findByText("Uber template2", { selector: "h5" })
    await screen.findByText("Uber template3", { selector: "h5" })

    // Add a nested property
    fireEvent.click(screen.getByTestId("Add Uber template2, property1"))
    // Input box displayed
    await screen.findByPlaceholderText("Uber template2, property1")

    // Hide
    fireEvent.click(screen.getByTestId("Hide Uber template2, property1"))
    // Input box not displayed
    expect(
      screen.queryAllByPlaceholderText("Uber template2, property1")
    ).toHaveLength(0)

    // Show
    fireEvent.click(screen.getByTestId("Show Uber template2, property1"))
    // Input box displayed
    await screen.findByPlaceholderText("Uber template2, property1")
  }, 30000)
})
