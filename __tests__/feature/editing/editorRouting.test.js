import { renderApp, createHistory, createStore } from "testUtils"
import { screen, waitFor } from "@testing-library/react"
import { featureSetup } from "featureUtils"
import { createState } from "stateUtils"

featureSetup()

describe("routing in editor", () => {
  describe("/editor", () => {
    const history = createHistory(["/editor"])

    it("redirects to /dashboard", async () => {
      renderApp(null, history)

      expect(history.location.pathname).toEqual("/dashboard")
    })
  })

  describe("/editor/:templateId when user has create permissions", () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uber1"])

    it("opens a new resource in editor", async () => {
      renderApp(null, history)

      expect(history.location.pathname).toEqual(
        "/editor/resourceTemplate:testing:uber1"
      )

      await screen.findByText("Uber template1", { selector: "h3" })
    })
  })

  describe("/editor/:templateId when user does not have create permissions", () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uber1"])
    const state = createState()
    state.authenticate.user.groups = []
    const store = createStore(state)

    it("redirects to dashboard", async () => {
      renderApp(store, history)

      expect(history.location.pathname).toEqual("/dashboard")
    })
  })

  describe("/editor/:templateId when an error", () => {
    const history = createHistory(["/editor/not:a:template"])

    it("redirects to templates and displays error", async () => {
      renderApp(null, history)

      await waitFor(() =>
        expect(history.location.pathname).toEqual("/templates")
      )

      await screen.findByText(/Not found/, { selector: ".alert p" })
    })
  })

  describe("/editor/resource/:resourceId when user has edit permissions", () => {
    const history = createHistory([
      "/editor/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
    ])

    it("opens existing resource in editor", async () => {
      renderApp(null, history)

      await waitFor(() =>
        expect(history.location.pathname).toEqual(
          "/editor/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
        )
      )

      await screen.findByText("Example Label", { selector: "h3" })
    })
  })

  describe("/editor/resource/:resourceId when user does not have edit permissions", () => {
    const history = createHistory([
      "/editor/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
    ])
    const state = createState()
    state.authenticate.user.groups = []
    const store = createStore(state)

    it("opens existing resource in preview", async () => {
      renderApp(store, history)

      await waitFor(() =>
        expect(history.location.pathname).toEqual("/dashboard")
      )

      await screen.findByText("Preview Resource", { selector: "h4" })
    }, 15000)
  })

  describe("/editor/resource/:resourceId when an error", () => {
    const history = createHistory(["/editor/resource/ld4p:RT:bf2:xxx"])

    it("redirects to dashboard and displays error", async () => {
      renderApp(null, history)

      await waitFor(() =>
        expect(history.location.pathname).toEqual("/dashboard")
      )

      await screen.findByText(/Not Found/, { selector: ".alert p" })
    }, 10000)
  })
})
