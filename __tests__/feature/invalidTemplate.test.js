import { renderApp, createHistory, createStore } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaSearch from "sinopiaSearch"
import { featureSetup } from "featureUtils"

jest.mock("sinopiaSearch")
featureSetup({ noMockSinopiaApi: true })

describe("an invalid resource template", () => {
  const history = createHistory(["/templates"])
  const store = createStore()

  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    results: [
      {
        id: "test:RT:bf2:RareMat:Instance",
        uri: "http://localhost:3000/resource/test:RT:bf2:RareMat:Instance",
        remark: "",
        resourceLabel: "Value template refs with non-unique resource URIs",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Instance",
      },
      {
        id: "test:RT:bf2:notFoundValueTemplateRefs",
        uri: "http://localhost:3000/resource/test:RT:bf2:notFoundValueTemplateRefs",
        remark: "",
        resourceLabel: "Not found value template refs",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Identifier",
      },
    ],
    totalHits: 2,
    options: {
      startOfRange: 0,
      resultsPerPage: 10,
    },
  })

  it("displays an error message when opened", async () => {
    renderApp(store, history)

    // Search for a template
    const input = screen.getByPlaceholderText(
      "Enter id, label, URI, remark, group, or author"
    )
    await fireEvent.change(input, { target: { value: "Not found" } })

    // try to open the template
    const link = await screen.findByTestId(
      "Create resource for Not found value template refs"
    )
    fireEvent.click(link)

    // check that the dismissable error message appears
    await screen.findByText(
      /The following referenced resource templates are not available in Sinopia/
    )
  })
})
