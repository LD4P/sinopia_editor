import { renderApp, createStore } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

describe("user that can edit, but not an owner, can view groups", () => {
  const uri =
    "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"

  it("is a read-only view of groups", async () => {
    const state = createState({ editGroups: true })
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    fireEvent.click(screen.getByRole("button", { name: `Edit ${uri}` }))

    await screen.findByText("Example Label", {
      selector: resourceHeaderSelector,
    })

    fireEvent.click(screen.getByText("Permissions"))

    await screen.findByText("Who owns this?")
    screen.getByText("Stanford University", { selector: "p" })
    screen.getByText("Cornell University", { selector: "p" })
    expect(screen.queryByLabelText("Save Group")).not.toBeInTheDocument()

    // Click cancel
    fireEvent.click(screen.getByLabelText("Cancel Save Group"))
  }, 20000)
})
