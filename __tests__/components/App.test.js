// Copyright 2019 Stanford University see LICENSE for license
import { fireEvent, waitFor, screen } from "@testing-library/react"
import { createStore, renderApp, createHistory } from "testUtils"
import { createState } from "stateUtils"
import Auth from "@aws-amplify/auth"
import fetchMock from "fetch-mock-jest"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

jest.mock("@aws-amplify/auth")

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mock(
    "http://localhost:3000/groups",
    '{"data":[{"id":"cornell","label":"Cornell"},{"id":"ld4p","label":"LD4P"},{"id":"other","label":"other"},{"id":"pcc","label":"Program for Cooperative Cataloging"},{"id":"stanford","label":"Stanford"}]}'
  )
  fetchMock.mock(
    "https://sinopia-exports-development.s3-us-west-2.amazonaws.com",
    '<?xml version="1.0" encoding="UTF-8"?><ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Contents><Key>alberta_2020-09-06T00:01:18.798Z.zip</Key></Contents><Contents><Key>sinopia_export_all_2020-09-06T00:01:17.621Z.zip</Key></Contents></ListBucketResult>'
  )
  fetchMock.mock(
    "https://ld4p.github.io/sinopia/help_and_resources/menu_content.html",
    '<ul><li><a href="https://github.com/ld4p/sinopia/wiki" target="_blank" rel="noopener noreferrer" className="menu-item">Sinopia help site</a></li></ul>'
  )
})

featureSetup()

describe("<App />", () => {
  beforeEach(() => {
    Auth.currentAuthenticatedUser.mockResolvedValue({ username: "Foo McBar" })
  })
  it("loads languages", async () => {
    const store = createStore()
    renderApp(store)

    await waitFor(() => store.getState().entities.languages.size > 0)
  })

  it("sets app version", async () => {
    renderApp()

    fireEvent.click(screen.getByText("Linked Data Editor"))

    screen.getByText(/v\d+\.\d+\.\d+/)
  })

  it("loads groups from sinopiaAPI into groupMap", async () => {
    const state = createState({ noGroupMap: true })
    const store = createStore(state)
    expect(store.getState().entities.groupMap).toEqual({})

    renderApp(store)
    await waitFor(() => store.getState().entities.groupMap !== {})

    expect(store.getState().entities.groupMap).toEqual({
      cornell: "Cornell",
      ld4p: "LD4P",
      other: "other",
      pcc: "Program for Cooperative Cataloging",
      stanford: "Stanford",
    })
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/groups", {
      method: "GET",
      headers: { Accept: "application/json" },
    })
  })

  it("loads exports", async () => {
    const state = createState({ noExports: true })
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor"))
    fireEvent.click(screen.getByText("Exports"))

    await screen.findByText(/sinopia_export_all/)
  })

  it("authenticates", () => {
    const state = createState({ notAuthenticated: true })
    const store = createStore(state)
    renderApp(store)

    expect(Auth.currentAuthenticatedUser).toHaveBeenCalled()
  })

  describe("when user is not authenticated", () => {
    beforeEach(() => {
      Auth.currentAuthenticatedUser.mockRejectedValue(
        new Error("Not authenticated")
      )
    })

    const state = createState({ notAuthenticated: true })
    const store = createStore(state)

    it("renders homepage for /", () => {
      const history = createHistory(["/"])
      renderApp(store, history)

      screen.getByTestId("news-item")
    })

    it("renders homepage for /search", () => {
      const history = createHistory(["/search"])
      renderApp(store, history)

      screen.getByTestId("news-item")
    })

    it("renders homepage for /<anything>", () => {
      const history = createHistory(["/foo"])
      renderApp(store, history)

      screen.getByTestId("news-item")
    })
  })

  describe("when user is authenticated and there is no resource", () => {
    it("renders homepage for /", () => {
      const history = createHistory(["/"])
      renderApp(null, history)

      screen.getByTestId("news-item")
    })

    it("creates new resource and renders editor for /editor/<rtId>", async () => {
      const history = createHistory(["/editor/resourceTemplate:bf2:Note"])
      renderApp(null, history)

      await screen.findByText("Note", { selector: resourceHeaderSelector })
    })

    it("redirects to /templates for /editor/<rtId> when rtId not found", async () => {
      const history = createHistory(["/editor/resourceTemplate:bf2:Notex"])
      renderApp(null, history)

      await waitFor(() =>
        expect(history.location.pathname).toEqual("/templates")
      )
      await screen.findByText(/Error retrieving resourceTemplate:bf2:Notex/)
    })

    it("renders templates for /templates", async () => {
      const history = createHistory(["/templates"])
      renderApp(null, history)

      await screen.findByText("Find a resource template")
    })

    it("renders search results for /search", () => {
      const state = createState({ hasSearchResults: true })
      const store = createStore(state)
      const history = createHistory(["/search"])
      renderApp(store, history)

      screen.getByText("Filter by class")
    })

    it("renders load for /load", () => {
      const history = createHistory(["/load"])
      renderApp(null, history)

      screen.getByText("Load RDF into Editor")
    })

    it("renders menu for /menu", async () => {
      const history = createHistory(["/menu"])
      renderApp(null, history)

      await screen.findByText("Sinopia help site")
    })

    it("404s for /<anything else>", () => {
      const history = createHistory(["/foo"])
      renderApp(null, history)

      screen.getByText("404")
    })
  })

  describe("when user is authenticated and there is a resource", () => {
    it("renders resource for /editor", async () => {
      const state = createState({ hasResourceWithLiteral: true })
      const store = createStore(state)
      const history = createHistory(["/"])
      renderApp(store, history)
      history.push("/editor")

      await screen.findByText("Abbreviated Title", {
        selector: resourceHeaderSelector,
      })
      screen.getByText("foo")
    })
  })
})
