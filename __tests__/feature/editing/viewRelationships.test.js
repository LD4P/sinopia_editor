import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaSearch from "sinopiaSearch"
import * as sinopiaApi from "sinopiaApi"
import { featureSetup } from "featureUtils"

featureSetup()

describe("relationships", () => {
  describe("when a resource has relationships", () => {
    const history = createHistory([
      "/editor/resource/a5c5f4c0-e7cd-4ca5-a20f-2a37fe1080d5",
    ])

    beforeEach(() => {
      jest.spyOn(sinopiaApi, "fetchResourceRelationships").mockResolvedValue({
        bfAdminMetadataInferredRefs: [],
        bfItemInferredRefs: [
          "http://localhost:3000/resource/862a55a2-71a5-47f5-9376-cc3a0ce3f65a",
        ],
        bfInstanceInferredRefs: [],
        bfWorkInferredRefs: [],
      })

      jest.spyOn(sinopiaSearch, "getSearchResultsByUris").mockResolvedValue({
        totalHits: 2,
        results: [
          {
            uri: "http://localhost:3000/resource/862a55a2-71a5-47f5-9376-cc3a0ce3f65a",
            label: "Item1",
            modified: "2021-10-29T13:22:25.500Z",
            type: ["http://id.loc.gov/ontologies/bibframe/Item"],
            group: "stanford",
            editGroups: [],
          },
          {
            uri: "http://localhost:3000/resource/f6ee6410-5206-492b-8e48-3b6333010c33",
            label: "Work1",
            modified: "2021-10-30T18:06:01.265Z",
            type: ["http://id.loc.gov/ontologies/bibframe/Work"],
            group: "stanford",
            editGroups: [],
          },
        ],
      })
    })

    it("lists the relationships", async () => {
      renderApp(null, history)

      await screen.findByText("Instance1", { selector: "h3" })

      fireEvent.click(screen.getByText("Relationships"))

      await screen.findByText("Works", { selector: "h5" })
      screen.getByText("Work1", { selector: "li" })
      screen.getByText("Items", { selector: "h5" })
      screen.getByText("Item1", { selector: "li" })
    })
  })

  describe("when a resource has no relationships", () => {
    const history = createHistory([
      "/editor/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
    ])

    beforeEach(() => {
      jest.spyOn(sinopiaApi, "fetchResourceRelationships").mockResolvedValue({
        bfAdminMetadataInferredRefs: [],
        bfItemInferredRefs: [],
        bfInstanceInferredRefs: [],
        bfWorkInferredRefs: [],
      })
    })

    it("lists versions, previews versions, and displays diffs", async () => {
      renderApp(null, history)

      await screen.findByText("Example Label", { selector: "h3" })

      // No relationships pill
      expect(screen.queryByText("Relationships")).not.toBeInTheDocument()
    })
  })
})
