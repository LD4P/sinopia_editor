import { renderApp } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaSearch from "sinopiaSearch"
import { resourceSearchResults } from "fixtureLoaderHelper"
import { featureSetup } from "featureUtils"

featureSetup()
jest.mock("sinopiaSearch")

describe("versions", () => {
  const uri =
    "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
  sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(
    resourceSearchResults(uri)
  )

  describe("when a change", () => {
    it("lists versions, previews versions, and displays diffs", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      // The result
      await screen.findByText(uri)

      // Click edit
      fireEvent.click(screen.getByTestId(`Edit ${uri}`))
      await screen.findByText("Example Label", {
        selector: "h3#resource-header",
      })

      // Click versions pill
      fireEvent.click(screen.getByText("Versions"))

      await screen.findByText("Compare from/to")
      expect(screen.getByTestId("Compare to current version")).toBeChecked()
      expect(screen.getByTestId("Compare from version 3")).toBeChecked()

      // Change something
      // Add a value
      fireEvent.change(
        screen.getByPlaceholderText("Uber template1, property4"),
        {
          target: { value: "foo" },
        }
      )
      fireEvent.keyDown(
        screen.getByPlaceholderText("Uber template1, property4"),
        { key: "Enter", code: 13, charCode: 13 }
      )

      fireEvent.click(screen.getByText("Compare", { selector: "button" }))
      await screen.findByText("Uber template1, property4 [en]", {
        selector: ".remove",
      })
      screen.getByText(/foo/, { selector: ".add" })

      fireEvent.click(screen.getByTestId("Close"))

      expect(
        screen.queryByText(/foo/, { selector: ".add" })
      ).not.toBeInTheDocument()
    }, 20000)
  })
  describe("when no change", () => {
    it("lists versions, previews versions, and displays diffs", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      // The result
      await screen.findByText(uri)

      // Click edit
      fireEvent.click(screen.getByTestId(`Edit ${uri}`))
      await screen.findByText("Example Label", {
        selector: "h3#resource-header",
      })

      // Click versions pill
      fireEvent.click(screen.getByText("Versions"))

      await screen.findByText("Compare from/to")

      // When compare to and compare from the same, Compare button disabled.
      expect(screen.getByTestId("Compare from version 3")).toBeChecked()
      fireEvent.click(screen.getByTestId("Compare to version 3"))
      expect(screen.getByText("Compare", { selector: "button" })).toBeDisabled()
      fireEvent.click(screen.getByTestId("Compare from version 2"))

      // fixtureLoaderHelper always returns the same resource regardless of versions, so no diff.
      fireEvent.click(screen.getByText("Compare", { selector: "button" }))
      await screen.findByText("No differences")

      fireEvent.click(screen.getByTestId("Close"))
    }, 25000)
  })
})
