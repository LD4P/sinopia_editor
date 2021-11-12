import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("editing a property URI", () => {
  describe("when a single property URI", () => {
    const history = createHistory(["/editor/resourceTemplate:testing:inputs"])

    it("does not allow property URI to be edited", async () => {
      renderApp(null, history)

      await screen.findByText("Inputs", { selector: "h3" })

      screen.getByText(
        "Property1 (http://sinopia.io/testing/Inputs/property1)",
        { selectors: ".property-uri" }
      )
      screen.getByText(
        "Property2 (http://sinopia.io/testing/Inputs/property2)",
        { selectors: ".property-uri" }
      )
      screen.getByText(
        "Property3 (http://sinopia.io/testing/Inputs/property3)",
        { selectors: ".property-uri" }
      )
      screen.getByText(
        "Property4 (http://sinopia.io/testing/Inputs/property4)",
        { selectors: ".property-uri" }
      )
      screen.getByText(
        "Property5 (http://sinopia.io/testing/Inputs/property5)",
        { selectors: ".property-uri" }
      )
    })
  })

  describe("when multiple property URIs", () => {
    const history = createHistory([
      "/editor/resourceTemplate:testing:multiplePropertyUris",
    ])

    it("does not allow property URI to be edited", async () => {
      renderApp(null, history)

      await screen.findByText("Inputs with multiple property URIs", {
        selector: "h3",
      })

      const input = screen.getByTestId("Select property for Literal input", {
        selector: "select",
      })
      expect(input).toHaveValue(
        "http://sinopia.io/testing/MultiplePropertyUris/property1"
      )
      const option1 = screen.getByText(
        "Property1 (http://sinopia.io/testing/MultiplePropertyUris/property1)",
        { selector: "option" }
      )
      expect(input).toContainElement(option1)
      const option2 = screen.getByText(
        "Property1b (http://sinopia.io/testing/MultiplePropertyUris/property1b)",
        { selector: "option" }
      )
      expect(input).toContainElement(option2)

      // Change the property URI
      fireEvent.change(input, {
        target: {
          value: "http://sinopia.io/testing/MultiplePropertyUris/property1b",
        },
      })
      expect(input).toHaveValue(
        "http://sinopia.io/testing/MultiplePropertyUris/property1b"
      )
    })
  })
})
