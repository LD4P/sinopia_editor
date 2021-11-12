import { renderApp, createHistory } from "testUtils"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import * as sinopiaApi from "sinopiaApi"

import { featureSetup } from "featureUtils"

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

    it("edits and saves", async () => {
      await screen.findAllByText("Title note", { selector: "h3" })

      const saveBtn = screen.getAllByText("Save", { selector: "button" })[0] // there are multiple save buttons, grab the first

      const input = screen.getByPlaceholderText("Note Text")
      fireEvent.change(input, { target: { value: "foo" } })
      fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

      // There is foo text.
      await waitFor(() =>
        expect(
          screen.getByText("foo", { selector: ".form-control" })
        ).toBeInTheDocument()
      )

      // Check that the title of the document is set the same as the rdfs:label
      screen.getByText("foo", { selector: "h3#resource-header" })

      expect(screen.queryByText("Permissions")).not.toBeInTheDocument()
      expect(saveBtn).not.toBeDisabled()
      fireEvent.click(saveBtn)

      // Change the owner
      const ownerSelect = await screen.findByRole("combobox", {
        name: "Who owns this?",
      })
      expect(ownerSelect).toHaveValue("stanford")
      fireEvent.change(ownerSelect, { target: { value: "pcc" } })
      expect(ownerSelect).toHaveValue("pcc")

      // Select editing groups
      screen.getByLabelText("Who else can edit?")
      fireEvent.click(screen.getByText("Select..."))
      fireEvent.click(screen.getByText("Cornell University"))
      fireEvent.click(screen.getByText("Duke University"))

      expect(screen.getByText("Cornell University, Duke University"))

      // A modal for group choice and save appears
      const modalSave = screen.getByRole("button", { name: "Save Group" })
      fireEvent.click(modalSave)
      // The resource is saved and is assigned a URI
      await screen.findAllByText(/URI for this resource/)

      // URL changes
      await waitFor(() =>
        expect(history.location.pathname).toEqual(
          "/editor/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
        )
      )

      screen.getByText("Permissions")
    })
  })
})
