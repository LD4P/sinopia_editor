import { renderApp } from "testUtils"
import { featureSetup } from "featureUtils"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import * as server from "sinopiaSearch"
import Config from "Config"
import * as sinopiaApi from "sinopiaApi"
import * as QuestioningAuthority from "utilities/QuestioningAuthority"

featureSetup()

describe("<Search />", () => {
  jest.spyOn(sinopiaApi, "putUserHistory").mockResolvedValue()

  const mockSearchResults = [
    {
      uri: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365",
      id: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365",
      label: "These twain",
      context: [
        {
          property: "Title",
          values: [" These twain"],
          selectable: true,
          drillable: false,
        },
        {
          property: "Type",
          values: [
            "http://id.loc.gov/ontologies/bflc/Hub",
            "http://id.loc.gov/ontologies/bibframe/Work",
          ],
          selectable: false,
          drillable: false,
        },
        {
          property: "Contributor",
          values: ["Bennett, Arnold,1867-1931."],
          selectable: false,
          drillable: false,
        },
      ],
    },
  ]
  const mockResponse = {
    results: mockSearchResults,
    response_header: { total_records: 15 },
  }

  jest
    .spyOn(QuestioningAuthority, "createLookupPromise")
    .mockResolvedValue(mockResponse)

  it("requests a QA search", async () => {
    renderApp()
    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    screen.getByLabelText("Search")
    // Sinopia is selected by default
    screen.getByDisplayValue("Sinopia")

    // Select an authority
    fireEvent.change(screen.getByDisplayValue("Sinopia"), {
      target: { value: "urn:discogs:master" },
    })

    screen.getByText("DISCOGS Releases")

    // Enter a query
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "twain" },
    })

    // Click search
    fireEvent.click(screen.getByTestId("Submit search"))

    // Display results
    await screen.findByText("Label / ID")
    await screen.findByText(/These twain/)

    // Display paging
    screen.getByText("»")

    // Display results message
    screen.getByText(/Displaying 1 - 10 of 15/)
  })

  it("requests a Sinopia search", async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {
        totalHits: 1,
        results: [
          {
            uri: "resource/ca0d53d0-2b99-4f75-afb0-739a6f0af4f4",
            label: "foo",
            title: ["foo"],
            type: ["http://id.loc.gov/ontologies/bibframe/Title"],
          },
        ],
      },
    ])

    renderApp()
    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    // Enter a query
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "foo" },
    })

    // Click search
    fireEvent.click(screen.getByTestId("Submit search"))

    // Called once
    expect(mockGetSearchResults).toBeCalledWith("foo", { startOfRange: 0 })

    // Result
    await screen.findByText(/foo/)

    screen.getByText("http://id.loc.gov/ontologies/bibframe/Title", {
      selector: "li",
    })
  })

  it("requests on enter", () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {
        totalHits: 0,
        results: [],
      },
    ])

    renderApp()
    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    // Enter a query
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "foo" },
    })

    // Hit enter
    fireEvent.keyPress(screen.getByLabelText("Search"), {
      key: "Enter",
      code: 13,
      charCode: 13,
    })

    // Called once
    expect(mockGetSearchResults).toBeCalledWith("foo", { startOfRange: 0 })
  })

  it("ignores when query is blank", () => {
    const mockGetSearchResults = jest.fn()

    renderApp()
    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    // Hit enter
    fireEvent.keyPress(screen.getByLabelText("Search"), {
      key: "Enter",
      code: 13,
      charCode: 13,
    })

    // Not called
    expect(mockGetSearchResults.mock.calls.length).toBe(0)
  })

  it("displays an error message", async () => {
    server.getSearchResultsWithFacets = jest.fn().mockResolvedValue([
      {
        totalHits: 0,
        results: [],
        error: new Error("Grrr..."),
      },
    ])

    renderApp()
    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    // Enter a query
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "foo" },
    })

    // Click search
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText("An error occurred while searching: Error: Grrr...")
  })

  it("retains sort order when paging", async () => {
    jest.spyOn(Config, "searchResultsPerPage", "get").mockReturnValue(2)
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([
      {
        totalHits: 3,
        results: [
          {
            uri: "resource/ca0d53d0-2b99-4f75-afb0-739a6f0af4f4",
            label: "foo1",
            title: ["foo1"],
            type: ["http://id.loc.gov/ontologies/bibframe/Title"],
          },
          {
            uri: "resource/ca0d53d0-2b99-4f75-afb0-739a6f0af4f5",
            label: "foo2",
            title: ["foo2"],
            type: ["http://id.loc.gov/ontologies/bibframe/Title"],
          },
          {
            uri: "resource/ca0d53d0-2b99-4f75-afb0-739a6f0af4f6",
            label: "foo3",
            title: ["foo3"],
            type: ["http://id.loc.gov/ontologies/bibframe/Title"],
          },
        ],
      },
    ])

    renderApp()
    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    // Enter a query
    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "foo" },
    })

    // Click search
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText("Sort by")

    // Change sort order
    screen.getByText("Relevance", { selector: "button.active" })
    fireEvent.click(screen.getByText("Sort by"))
    fireEvent.click(screen.getByText("Modified date, newest first"))

    await waitFor(() =>
      expect(
        screen.queryByText("Relevance", { selector: "button.active" })
      ).not.toBeInTheDocument()
    )
    screen.getByText("Modified date, newest first", {
      selector: "button.active",
    })

    fireEvent.click(screen.getByText("›"))

    await screen.findByText("2", { selector: "li.active > button" })
    screen.getByText("Modified date, newest first", {
      selector: "button.active",
    })

    expect(mockGetSearchResults.mock.calls).toEqual([
      ["foo", { startOfRange: 0 }],
      [
        "foo",
        {
          startOfRange: 0,
          resultsPerPage: 2,
          sortField: "modified",
          sortOrder: "desc",
        },
      ],
      [
        "foo",
        {
          startOfRange: 2,
          resultsPerPage: 2,
          sortField: "modified",
          sortOrder: "desc",
        },
      ],
    ])
  })
})
