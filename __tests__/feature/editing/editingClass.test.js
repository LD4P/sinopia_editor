import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("editing a class for a resource", () => {
  describe("when a single property class", () => {
    const history = createHistory(["/editor/resourceTemplate:testing:inputs"])

    it("does not allow property URI to be edited", async () => {
      renderApp(null, history)

      await screen.findByText("Inputs", { selector: "h3#resource-header" })

      screen.getByText("Class: Inputs (http://sinopia.io/testing/Inputs)", {
        selectors: ".resource-class",
      })
      screen.getByText("Class: Literal (http://sinopia.io/testing/Literal)", {
        selectors: ".resource-class",
      })
    })
  })

  describe("when multiple classes", () => {
    const history = createHistory([
      "/editor/resourceTemplate:testing:multipleClassInputs",
    ])

    it("allows class to be edited", async () => {
      renderApp(null, history)

      await screen.findByText("Multiple class inputs", {
        selector: "h3#resource-header",
      })

      // Default class is displayed
      screen.getByText(
        "Literal (http://sinopia.io/testing/MultipleClassLiteral)",
        { selector: "div" }
      )

      const checkbox = screen.getByLabelText(
        "Literal subclass A (http://sinopia.io/testing/MultipleClassLiteral-subclassA)"
      )
      expect(checkbox).not.toBeChecked()
      fireEvent.click(checkbox)
      expect(checkbox).toBeChecked()

      screen.getByLabelText(
        "http://sinopia.io/testing/MultpleClassLiteral-subclassB"
      )
    })
  })
})
