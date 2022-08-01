import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

describe("reordering properties", () => {
  it("reorders nested properties", async () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uber1"])
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    const nestedResource1 = screen.getByTestId(
      "Uber template1, property19 panelProperty",
      { selector: "div.container" }
    )

    // No arrows.
    expect(
      within(nestedResource1).queryByTestId("Move down Uber template4")
    ).not.toBeInTheDocument()
    expect(
      within(nestedResource1).queryByTestId("Move up Uber template4")
    ).not.toBeInTheDocument()

    // Add a value
    const inputs1 = within(nestedResource1).getAllByPlaceholderText(
      "Uber template4, property1"
    )
    fireEvent.change(inputs1[0], { target: { value: "a" } })
    fireEvent.keyDown(inputs1[0], { key: "Enter", code: 13, charCode: 13 })

    // Add more nested resources
    const addAnotherBtn = within(nestedResource1).getByTestId(
      "Add another Uber template4"
    )
    fireEvent.click(addAnotherBtn)
    fireEvent.click(addAnotherBtn)
    await waitFor(() =>
      expect(
        within(nestedResource1).queryAllByTestId(
          "Uber template4 nestedResource"
        )
      ).toHaveLength(3)
    )

    const inputs2 = within(nestedResource1).getAllByPlaceholderText(
      "Uber template4, property1"
    )
    fireEvent.change(inputs2[1], { target: { value: "b" } })
    fireEvent.keyDown(inputs2[1], { key: "Enter", code: 13, charCode: 13 })
    fireEvent.change(inputs2[2], { target: { value: "c" } })
    fireEvent.keyDown(inputs2[2], { key: "Enter", code: 13, charCode: 13 })

    const nestedResources1 = within(nestedResource1).queryAllByTestId(
      "Uber template4 nestedResource"
    )

    // First has down arrow.
    expect(
      within(nestedResources1[0]).queryByTestId("Move up Uber template4")
    ).not.toBeInTheDocument()
    within(nestedResources1[0]).getByTestId("Move down Uber template4")
    // Second has up and down arrow
    within(nestedResources1[1]).getByTestId("Move down Uber template4")
    within(nestedResources1[1]).getByTestId("Move up Uber template4")
    // Third has up arrow
    expect(
      within(nestedResources1[2]).queryByTestId("Move down Uber template4")
    ).not.toBeInTheDocument()
    within(nestedResources1[2]).getByTestId("Move up Uber template4")

    // Move "b" up
    within(nestedResources1[1]).getByTestId("Move up Uber template4").click()

    const values1 = within(nestedResource1).getAllByPlaceholderText(
      "Uber template4, property1"
    )
    expect(values1[0]).toHaveTextContent(/b/)
    expect(values1[1]).toHaveTextContent(/a/)
    expect(values1[2]).toHaveTextContent(/c/)

    // Move "a" down
    within(nestedResources1[0]).getByTestId("Move down Uber template4").click()
    const values2 = within(nestedResource1).getAllByPlaceholderText(
      "Uber template4, property1"
    )
    expect(values2[0]).toHaveTextContent(/b/)
    expect(values2[1]).toHaveTextContent(/c/)
    expect(values2[2]).toHaveTextContent(/a/)
  }, 20000)
})
