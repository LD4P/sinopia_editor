import { renderApp, createStore, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { featureSetup, resourceHeaderSelector } from "featureUtils"
import * as sinopiaApi from "sinopiaApi"

featureSetup()

const history = createHistory([
  "/editor/resource/b6c5f4c0-e7cd-4ca5-a20f-2a37fe1080d6",
])

jest.spyOn(sinopiaApi, "putResource").mockResolvedValue(true)

describe("user that can edit, but not an owner, can view groups", () => {
  it("user changes groups", async () => {
    const state = createState()
    const store = createStore(state)
    renderApp(store, history)

    await screen.findByText("Inputs", { selector: resourceHeaderSelector })
    fireEvent.click(screen.getByText("Permissions"))

    // Change the owner
    const ownerSelect = await screen.findByTestId("Who owns this?")
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
