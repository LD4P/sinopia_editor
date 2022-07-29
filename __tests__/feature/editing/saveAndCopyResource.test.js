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

describe("saving a resource", () => {
  describe("after opening a new resource", () => {
    const history = createHistory(["/editor/resourceTemplate:bf2:Title:Note"])
    renderApp(null, history)

    it("edits, saves, and copies the resource template", async () => {
      await screen.findByText("Title note", {
        selector: resourceHeaderSelector,
      })

      const saveBtn = screen.getAllByText("Save", { selector: "button" })[0] // there are multiple save buttons, grab the first
      const copyBtn = await screen.getAllByTestId(
        "Copy this resource to a new resource"
      )[0]

      expect(saveBtn).toBeDisabled()
      expect(copyBtn).toBeDisabled()

      const input = screen.getByPlaceholderText("Note Text")
      fireEvent.change(input, { target: { value: "foo" } })
      fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

      // There is remove button
      screen.getByTestId("Remove foo")
      // There is language button.
      expect(screen.getByTestId("Change language for foo")).toHaveTextContent(
        "en"
      )

      expect(saveBtn).not.toBeDisabled()
      fireEvent.click(saveBtn)

      // A modal for group choice and save appears
      const modalSave = screen.getByRole("button", { name: "Save Group" })
      fireEvent.click(modalSave)
      // The resource is saves and is assigned a URI
      await screen.findAllByText(/URI for this resource/)

      // The copy resource button is active
      expect(copyBtn).not.toBeDisabled()
      fireEvent.click(copyBtn)
      await screen.findAllByText(/Copied .+ to new resource./)

      // There are nav tabs and a duplicate resource with the same content
      await screen.findAllByText("foo", {
        selector: ".nav-item.active .tab-link span",
      })
      await screen.findAllByText("foo", {
        selector: ".nav-item:not(.active) .tab-link span",
      })
    })
  })
})
