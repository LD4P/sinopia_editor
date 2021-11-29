import { fireEvent, screen } from "@testing-library/react"
import { renderApp } from "testUtils"
import * as sinopiaSearch from "sinopiaSearch"
import * as sinopiaApi from "sinopiaApi"
import { resourceSearchResults } from "fixtureLoaderHelper"
import { featureSetup } from "featureUtils"

featureSetup()

describe("searching and view relationships for a resource", () => {
  describe("for a resource that is a BF:instance", () => {
    const uri =
      "http://localhost:3000/resource/a5c5f4c0-e7cd-4ca5-a20f-2a37fe1080d5"
    beforeEach(() => {
      // Setup search component to return known resource
      jest
        .spyOn(sinopiaSearch, "getSearchResultsWithFacets")
        .mockResolvedValue(
          resourceSearchResults(
            uri,
            "http://id.loc.gov/ontologies/bibframe/Instance"
          )
        )

      jest.spyOn(sinopiaApi, "fetchResourceRelationships").mockResolvedValue({
        bfAdminMetadataAllRefs: [],
        bfItemAllRefs: [],
        bfInstanceAllRefs: [],
        bfWorkAllRefs: [
          "http://localhost:3000/resource/f6ee6410-5206-492b-8e48-3b6333010c33",
        ],
      })
      jest.spyOn(sinopiaSearch, "getSearchResultsByUris").mockResolvedValue({
        totalHits: 1,
        results: [
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

    it("renders relationships", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

      fireEvent.change(screen.getByLabelText("Search"), {
        target: { value: uri },
      })
      fireEvent.click(screen.getByTestId("Submit search"))

      await screen.findByText(uri)
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Instance")

      fireEvent.click(
        await screen.findByTestId(`Show relationships for ${uri}`)
      )
      await screen.findByTestId(`Hide relationships for ${uri}`)

      screen.getByText("Works", { selector: "h5" })
      screen.getByText(
        /http:\/\/localhost:3000\/resource\/f6ee6410-5206-492b-8e48-3b6333010c33/
      )
      screen.getByText(/Work1/)
      screen.getByText("http://id.loc.gov/ontologies/bibframe/Work")
    }, 10000)
  })
})
