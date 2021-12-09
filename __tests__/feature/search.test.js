import { findByText, fireEvent, screen } from "@testing-library/react"
import { renderApp } from "testUtils"
import Config from "Config"
import { featureSetup } from "featureUtils"
import * as sinopiaSearch from "sinopiaSearch"

featureSetup()

describe("sinopia resource search", () => {
  const fooBarHit = {
    _index: "sinopia_resources",
    _type: "sinopia",
    _id: "resource/cornell/34ef053e-f558-4299-a8a7-c8b79a598d99",
    _score: 0.2876821,
    _source: {
      title: ["foo bar"],
      uri: "http://platform:8080/resource/cornell/34ef053e-f558-4299-a8a7-c8b79a598d99",
      label: "foo bar",
      type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
      group: "cornell",
      created: "2019-11-27T19:05:50.496Z",
      modified: "2019-11-27T19:05:50.496Z",
    },
  }

  const fooHit = {
    _index: "sinopia_resources",
    _type: "sinopia",
    _id: "resource/cornell/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe",
    _score: 0.2876819,
    _source: {
      title: ["foo"],
      uri: "http://platform:8080/resource/cornell/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe",
      label: "foo",
      type: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
      group: "cornell",
      created: "2019-11-27T19:05:52.496Z",
      modified: "2019-11-27T19:05:52.496Z",
    },
  }

  const bazHit = {
    _index: "sinopia_resources",
    _type: "sinopia",
    _id: "resource/stanford/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe",
    _score: 0.2876822,
    _source: {
      title: ["baz"],
      uri: "http://platform:8080/resource/stanford/d7b0eb50-17bb-4258-83be-2cef2e9fc3ad",
      label: "baz",
      type: ["http://id.loc.gov/ontologies/bibframe/Title"],
      group: "stanford",
      created: "2019-11-27T19:05:48.496Z",
      modified: "2019-11-27T19:05:48.496Z",
    },
  }

  const successResult = {
    took: 8,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: 3 },
      max_score: 0.2876821,
      hits: [fooBarHit, fooHit, bazHit],
    },
  }

  const successResultResorted = {
    took: 8,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: 3 },
      max_score: 0.2876821,
      hits: [bazHit, fooBarHit, fooHit],
    },
  }

  const successResultPage1 = {
    took: 8,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: 3 },
      max_score: 0.2876821,
      hits: [fooBarHit, fooHit],
    },
  }

  const successResultPage2 = {
    took: 8,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: 3 },
      max_score: 0.2876821,
      hits: [bazHit],
    },
  }

  const noResult = {
    took: 8,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: { value: 0 },
      max_score: 0,
      hits: [],
    },
  }

  // Saves global fetch in order to be restored after each test with mocked fetch
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
  })

  it("allows the user to filter results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => successResult }))

    renderApp()

    fireEvent.click(screen.getByText(/Linked Data Editor/, { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "*" },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(/foo bar/)

    // Does not display template guess results when search on *
    expect(screen.queryByText("Template results")).not.toBeInTheDocument()

    // TODO: why don't filtering options show up in test UI? -- https://github.com/LD4P/sinopia_editor/issues/2499
    // screen.debug()
    // fireEvent.click(screen.getByText(/Filter by group/, { selector: 'button' }))
    // fireEvent.click(screen.getByText('Cornell University'))
  })

  it("allows the user to sort results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => successResult }))

    renderApp()

    fireEvent.click(screen.getByText(/Linked Data Editor/, { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "*" },
    })
    fireEvent.click(screen.getByTestId("Submit search", { selector: "button" }))

    await screen.findByText(/Displaying 1 - 3 of 3/)

    const resources = screen.getAllByText(/http:\/\/platform:8080\/resource\//)
    expect(resources).toHaveLength(3)
    await findByText(resources[0], /foo bar/)
    await findByText(resources[1], /foo/)
    await findByText(resources[2], /baz/)

    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ json: () => successResultResorted })
      )

    fireEvent.click(screen.getByText(/Sort by/, { selector: "button" }))
    fireEvent.click(screen.getByText(/Label, ascending/))

    await screen.findByText(/Displaying 1 - 3 of 3/)

    const resourcesResorted = screen.getAllByText(
      /http:\/\/platform:8080\/resource\//
    )
    expect(resourcesResorted).toHaveLength(3)
    await findByText(resourcesResorted[0], /baz/)
    await findByText(resourcesResorted[1], /foo bar/)
    await findByText(resourcesResorted[2], /foo/)
  })

  it("pages results when the total number exceeds searchResultsPerPage", async () => {
    jest.spyOn(Config, "searchResultsPerPage", "get").mockReturnValue(2)

    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ json: () => successResultPage1 })
      )

    renderApp()

    fireEvent.click(screen.getByText(/Linked Data Editor/, { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "*" },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    // check results on page 1
    await screen.findByText(/Displaying 1 - 2 of 3/)
    await screen.findByText(/foo bar/)
    expect(screen.queryByText(/baz/)).not.toBeInTheDocument()

    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ json: () => successResultPage2 })
      )

    // confirm moving to the next page works
    fireEvent.click(screen.getByLabelText("2", { selector: "button" }))
    await screen.findByText(/Displaying 3 - 3 of 3/)
    await screen.findByText(/baz/)
  })

  it("displays an appropriate message when there are no results for the search term(s)", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => noResult }))

    renderApp()

    fireEvent.click(screen.getByText(/Linked Data Editor/, { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "asdfqwerty" },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(/Displaying 0 Search Results/)
  })

  it("displays template guess search results", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => noResult }))

    jest.spyOn(sinopiaSearch, "getTemplateSearchResults").mockResolvedValue({
      totalHits: 1,
      results: [
        {
          id: "testing:defaultDate",
          uri: "http://localhost:3000/resource/testing:defaultDate",
          resourceLabel: "Default date",
          resourceURI: "http://testing/defaultDate",
          group: "other",
          editGroups: [],
          groupLabel: "Other",
        },
      ],
    })

    renderApp()

    fireEvent.click(screen.getByText(/Linked Data Editor/, { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "asdfqwerty" },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    // Open toggle
    fireEvent.click(await screen.findByText(/Template results/))
    screen.getByText(/testing:defaultDate/)
  })

  it("maintains uri and query when change pages", async () => {
    renderApp()

    fireEvent.click(screen.getByText(/Linked Data Editor/, { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "foo" },
    })
    fireEvent.change(screen.getByTestId("Search type"), {
      target: { value: "urn:ld4p:sinopia/Instance" },
    })

    expect(screen.getByLabelText("Search")).toHaveValue("foo")
    expect(screen.getByTestId("Search type")).toHaveValue(
      "urn:ld4p:sinopia/Instance"
    )

    // Change the page
    fireEvent.click(screen.getByText(/Resource Templates/, { selector: "a" }))
    await screen.findByText(/Find a resource template/)

    expect(screen.getByLabelText("Search")).toHaveValue("foo")
    expect(screen.getByTestId("Search type")).toHaveValue(
      "urn:ld4p:sinopia/Instance"
    )
  })
})
