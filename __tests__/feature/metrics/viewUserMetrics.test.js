import { renderApp } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaMetrics from "sinopiaMetrics"
import { featureSetup } from "featureUtils"

featureSetup()

describe("viewing user metrics", () => {
  describe("when no error", () => {
    beforeEach(() => {
      jest.spyOn(sinopiaMetrics, "getUserCount").mockResolvedValue({ count: 1 })
    })

    it("displays the metrics", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Users", { selector: "a" }))

      await screen.findByText("User metrics")

      await screen.findByText("User count")
      screen.getByText("1", { selector: ".card-text" })
    })
  })

  describe("when an error", () => {
    beforeEach(() => {
      jest
        .spyOn(sinopiaMetrics, "getUserCount")
        .mockRejectedValue(new Error("Oooops"))
    })

    it("displays the error", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Users", { selector: "a" }))

      await screen.findByText(/Oooops/, { selector: ".alert p" })
    })
  })
})
