import { renderApp, createStore } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { featureSetup } from "featureUtils"
import * as sinopiaApi from "sinopiaApi"

featureSetup()

const uri =
  "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
jest.spyOn(sinopiaApi, "putResource").mockResolvedValue(true)

describe("user that can edit, but not an owner, can view groups", () => {
  it("user changes groups", async () => {
    const state = createState()
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))
    await screen.findByText(uri)
    fireEvent.click(screen.getByRole("button", { name: `Edit ${uri}` }))

    await screen.findByText("Example Label", { selector: "h3#resource-header" })
    fireEvent.click(screen.getByText("Permissions"))

    // Change the owner
    const ownerSelect = await screen.findByRole("combobox", {
      name: "Who owns this?",
    })
    expect(ownerSelect).toHaveValue("stanford")
    fireEvent.change(ownerSelect, { target: { value: "pcc" } })
    expect(ownerSelect).toHaveValue("pcc")

    // Select editing groups
    screen.getByText("Who else can edit?")
    fireEvent.click(screen.getByText("Cornell University"))
    fireEvent.click(screen.getByText("Duke University"))
    screen.getByText("Cornell University, Duke University")

    // A modal for group choice and save appears
    const modalSave = screen.getByTestId("Save Group")
    fireEvent.click(modalSave)
    await screen.findByText("Saved")
  }, 25000)
})
