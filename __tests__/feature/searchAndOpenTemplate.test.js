import { renderApp, createHistory, createStore } from "testUtils"
import { act, fireEvent, screen } from "@testing-library/react"
import * as sinopiaSearch from "sinopiaSearch"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()
jest.mock("sinopiaSearch")
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

describe("searching and opening a resource", () => {
  const history = createHistory(["/templates"])
  const store = createStore()
  const promise = Promise.resolve()

  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    results: [
      {
        id: "resourceTemplate:bf2:Title",
        uri: "http://localhost:3000/resource/resourceTemplate:bf2:Title",
        remark: "Title information relating to a resource",
        resourceLabel: "Instance Title",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Title",
      },
      {
        id: "resourceTemplate:bf2:Title:Note",
        uri: "http://localhost:3000/resource/resourceTemplate:bf2:Title:Note",
        remark: "Note about the title",
        resourceLabel: "Title note",
        resourceURI: "http://id.loc.gov/ontologies/bibframe/Note",
      },
    ],
    totalHits: 2,
    options: {
      startOfRange: 0,
      resultsPerPage: 10,
    },
  })

  it("adds the template to recently used template history", async () => {
    renderApp(store, history)

    const queryString = "title"

    // Search for a template
    const input = screen.getByPlaceholderText(
      "Enter id, label, URI, remark, group, or author"
    )
    await fireEvent.change(input, { target: { value: queryString } })
    await screen.findByText("resourceTemplate:bf2:Title:Note")

    // open the template
    const link = await screen.findByTestId("Create resource for Title note")
    fireEvent.click(link)
    await act(() => promise)

    // return to the RT list
    const rtLink = await screen.findByText("Resource Templates", {
      selector: "a",
    })
    fireEvent.click(rtLink)

    // confirm RT query is still in place (stored in state and not cleared)
    expect(input.value).toEqual(queryString)

    // Clear search button empties the search field
    fireEvent.click(
      screen.getByTestId("Clear query string", { selector: "button" })
    )
    expect(
      screen.getByPlaceholderText(
        "Enter id, label, URI, remark, group, or author"
      ).value
    ).toEqual("")

    // see the recently used RTs
    const histTemplateBtn = await screen.findByText(
      "Most recently used templates"
    )
    fireEvent.click(histTemplateBtn)
    const rtHeaders = screen.getAllByText("Label / ID")
    expect(rtHeaders).toHaveLength(2)

    // open the recenly used RTs and click
    const rtLinks = screen.getAllByTestId("Create resource for Title note")
    expect(rtLinks).toHaveLength(2)
    fireEvent.click(rtLinks[0])
    await screen.findByText("Title note", { selector: resourceHeaderSelector })

    // There are nav tabs and a duplicate resource
    await screen.findAllByText("Title note", {
      selector: ".nav-item.active .tab-link span",
    })
    await screen.findAllByText("Title note", {
      selector: ".nav-item:not(.active) .tab-link span",
    })
  })
})
