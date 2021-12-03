import { renderApp } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaMetrics from "sinopiaMetrics"
import * as sinopiaSearch from "sinopiaSearch"
import { featureSetup } from "featureUtils"

featureSetup()

describe("viewing template metrics", () => {
  describe("when no error", () => {
    beforeEach(() => {
      jest
        .spyOn(sinopiaMetrics, "getTemplateCount")
        .mockResolvedValue({ count: 1 })
      jest
        .spyOn(sinopiaMetrics, "getTemplateCreatedCount")
        .mockResolvedValue({ count: 5 })
      jest
        .spyOn(sinopiaMetrics, "getTemplateEditedCount")
        .mockResolvedValue({ count: 10 })
      jest
        .spyOn(sinopiaMetrics, "getTemplateUsageCount")
        .mockResolvedValue({ count: 15 })

      jest.spyOn(sinopiaSearch, "getTemplateSearchResults").mockResolvedValue({
        totalHits: 1,
        results: [
          {
            id: "ld4p:RT:bf2:Title:AbbrTitle",
            resourceLabel: "Abbreviated Title",
            resourceURI:
              "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
          },
        ],
        error: undefined,
      })
    })

    it("displays the metrics", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Templates", { selector: "a" }))

      await screen.findByText("Template metrics")

      await screen.findByText("Template count")
      screen.getByText("The total number of templates.")
      screen.getByText("1", { selector: ".card-text" })

      await screen.findByText("Template creation")
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

      expect(sinopiaMetrics.getTemplateCreatedCount).toHaveBeenCalledWith({
        startDate: "2021-01-01",
        endDate: "2022-01-01",
        group: "stanford",
      })

      await screen.findByText("Template editing")
      screen.getByText("10", { selector: ".card-text" })

      await screen.findByText("Template usage")
      screen.getByText("0", { selector: ".card-text" }) // starts as 0 if no default specified

      // Change template usage filter
      fireEvent.change(screen.getByPlaceholderText(/Enter id, label/), {
        target: { value: "ld4p:RT:bf2:Title:AbbrTitle" },
      })
      fireEvent.click(await screen.findByText(/Abbreviated Title/))

      await screen.findByText("15", { selector: ".card-text" })

      expect(sinopiaMetrics.getTemplateUsageCount).toHaveBeenCalledWith({
        templateId: "ld4p:RT:bf2:Title:AbbrTitle",
      })
    })
  })

  describe("when an error", () => {
    beforeEach(() => {
      jest
        .spyOn(sinopiaMetrics, "getTemplateCount")
        .mockRejectedValue(new Error("Oooops"))
    })

    it("displays the error", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Templates", { selector: "a" }))

      await screen.findByText(/Oooops/, { selector: ".alert p" })
    })
  })
})
