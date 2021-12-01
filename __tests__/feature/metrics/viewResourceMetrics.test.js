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
      jest
        .spyOn(sinopiaMetrics, "getResourceCreatedCount")
        .mockResolvedValue({ count: 5 })
      jest
        .spyOn(sinopiaMetrics, "getResourceEditedCount")
        .mockResolvedValue({ count: 10 })
    })

    it("displays the metrics", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Resources", { selector: "a" }))

      await screen.findByText("Resource metrics")

      await screen.findByText("Resource count")
      screen.getByText("1", { selector: ".card-text" })

      await screen.findByText("Resource creation")
      screen.getByText("5", { selector: ".card-text" })

      // Change template creation filters
      fireEvent.change(screen.getByLabelText("Start"), {
        target: { value: "2021-01-01" },
      })
      fireEvent.change(screen.getByLabelText("End"), {
        target: { value: "2022-01-01" },
      })
      fireEvent.change(screen.getByLabelText("Group"), {
        target: { value: "stanford" },
      })

      await screen.findByText("Resource editing")
      screen.getByText("10", { selector: ".card-text" })

      expect(sinopiaMetrics.getResourceCreatedCount).toHaveBeenCalledWith({
        startDate: "2021-01-01",
        endDate: "2022-01-01",
        group: "stanford",
      })
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
