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

      screen.getByTestId(
        "Select classes for Literal with multiple optional classes",
        {
          selector: "select",
        }
      )
      const input = screen.getByTestId(
        "Select classes for Multiple class inputs",
        {
          selector: "select",
        }
      )
      expect(input).toHaveValue([
        "http://sinopia.io/testing/MultipleClassInputs",
      ])
      const option1 = screen.getByText(
        "Multiple Class Inputs subclass A (http://sinopia.io/testing/MultipleClassInputs-subclassA)",
        { selector: "option" }
      )
      expect(input).toContainElement(option1)
      const option2 = screen.getByText(
        "Multiple Class Inputs subclass B (http://sinopia.io/testing/MultipleClassInputs-subclassB)",
        { selector: "option" }
      )
      expect(input).toContainElement(option2)

      // Add a class
      fireEvent.change(input, {
        target: {
          value: "http://sinopia.io/testing/MultipleClassInputs-subclassA",
        },
      })
      expect(input).toHaveValue([
        "http://sinopia.io/testing/MultipleClassInputs",
        "http://sinopia.io/testing/MultipleClassInputs-subclassA",
      ])

      // Remove a class
      fireEvent.change(input, {
        target: {
          value: "http://sinopia.io/testing/MultipleClassInputs-subclassA",
        },
      })
      expect(input).toHaveValue([
        "http://sinopia.io/testing/MultipleClassInputs",
      ])

      // Can't remove default class
      fireEvent.change(input, {
        target: {
          value: "http://sinopia.io/testing/MultipleClassInputs",
        },
      })
      expect(input).toHaveValue([
        "http://sinopia.io/testing/MultipleClassInputs",
      ])
    })
  })
})
