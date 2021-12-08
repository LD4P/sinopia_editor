import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

describe("versions", () => {
  const history = createHistory([
    "/editor/resource/b6c5f4c0-e7cd-4ca5-a20f-2a37fe1080d6",
  ])

  describe("when a change", () => {
    it("lists versions, previews versions, and displays diffs", async () => {
      renderApp(null, history)

      await screen.findByText("Inputs", {
        selector: resourceHeaderSelector,
      })

      // Click versions pill
      fireEvent.click(screen.getByText("Versions"))

      await screen.findByText("Compare from/to")
      expect(screen.getByTestId("Compare to current version")).toBeChecked()
      expect(screen.getByTestId("Compare from version 3")).toBeChecked()

      // Change something
      const input = screen.getAllByPlaceholderText("Literal input")[0]
      fireEvent.change(input, {
        target: { value: "foo" },
      })
      fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

      fireEvent.click(screen.getByText("Compare", { selector: "button" }))
      await screen.findByText("A literal value [en]", {
        selector: ".remove",
      })
      screen.getByText(/foo/, { selector: ".add" })

      fireEvent.click(screen.getByTestId("Close"))

      expect(
        screen.queryByText(/foo/, { selector: ".add" })
      ).not.toBeInTheDocument()
    }, 15000)
  })
  describe("when no change", () => {
    it("lists versions, previews versions, and displays diffs", async () => {
      renderApp(null, history)

      await screen.findByText("Inputs", {
        selector: resourceHeaderSelector,
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
    }, 15000)
  })
})
