import { renderApp } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaMetrics from "sinopiaMetrics"
import { featureSetup } from "featureUtils"

featureSetup()

describe("viewing resource metrics", () => {
  describe("when no error", () => {
    beforeEach(() => {
      jest
        .spyOn(sinopiaMetrics, "getResourceCount")
        .mockResolvedValue({ count: 1 })
    })

    it("displays the metrics", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Resources", { selector: "a" }))

      await screen.findByText("Resource metrics")

      await screen.findByText("Resource count")
      screen.getByText("1", { selector: ".card-text" })
    })
  })

  describe("when an error", () => {
    beforeEach(() => {
      jest
        .spyOn(sinopiaMetrics, "getResourceCount")
        .mockRejectedValue(new Error("Oooops"))
    })

    it("displays the error", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Resources", { selector: "a" }))

      await screen.findByText(/Oooops/, { selector: ".alert p" })
    })
  })
})
