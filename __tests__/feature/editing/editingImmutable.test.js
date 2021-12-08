import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaApi from "sinopiaApi"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

jest
  .spyOn(sinopiaApi, "postResource")
  .mockResolvedValue(
    "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
  )

describe("editing an immutable property", () => {
  const history = createHistory(["/editor/resourceTemplate:bf2:Note:Immutable"])
  renderApp(null, history)

  it("allows editing before save, but not after save", async () => {
    await screen.findByText("Immutable note", {
      selector: resourceHeaderSelector,
    })

    const saveBtn = screen.getAllByText("Save", { selector: "button" })[0] // there are multiple save buttons, grab the first

    const input = screen.getByPlaceholderText("Note")
    fireEvent.change(input, { target: { value: "foo" } })
    fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

    expect(saveBtn).not.toBeDisabled()
    fireEvent.click(saveBtn)

    // A modal for group choice and save appears
    const modalSave = screen.getByRole("button", { name: "Save Group" })
    fireEvent.click(modalSave)
    // The resource is saved and is assigned a URI
    await screen.findAllByText(/URI for this resource/)

    // No longer editable
    expect(screen.queryByPlaceholderText("Note")).not.toBeInTheDocument()
    screen.getByText("foo [en]")
  }, 10000)
})
