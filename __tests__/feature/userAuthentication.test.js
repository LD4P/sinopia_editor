// Copyright 2018 Stanford University see LICENSE for license

import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import { createState } from "stateUtils"
import { createStore, renderApp } from "testUtils"
import Auth from "@aws-amplify/auth"
import * as sinopiaApi from "sinopiaApi"

jest.mock("@aws-amplify/auth")
jest.spyOn(sinopiaApi, "fetchUser").mockResolvedValue({
  data: { history: { template: [], resource: [], search: [] } },
})

describe("user authentication", () => {
  Auth.signOut.mockResolvedValue()
  Auth.currentAuthenticatedUser.mockRejectedValue()
  it("allows a logged in user to log out and allows a new one to login", async () => {
    Auth.signIn.mockResolvedValue({
      username: "Baz Le Quux",
      signInUserSession: {
        idToken: { payload: { "cognito:groups": ["stanford"] } },
      },
    })
    renderApp()
    screen.getByText(/Foo McBar/) // user Foo McBar should be logged in already when using default test redux store

    // logout, and confirm that the UI gets rid of the old user name
    // and removes elements that require authentication to view
    fireEvent.click(screen.getByText("Logout", { selector: "a" }))

    // likely that things will have already re-rendered, but if not, wait for it
    if (screen.queryByText(/Foo McBar/)) {
      await waitForElementToBeRemoved(() => screen.queryByText(/Foo McBar/))
    }
    // check for elements indicating we were sent back to the login page
    expect(screen.queryByText("Logout")).not.toBeInTheDocument()
    screen.getByText(/Latest news/)
    screen.getByText(/Sinopia Version \d+.\d+.\d+ highlights/)
    screen.getByText("Sinopia help site", { selector: "a" })

    // login as a different user
    fireEvent.change(screen.getByLabelText("User name"), {
      target: { value: "baz.le.quux@example.edu" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password2" },
    })
    fireEvent.click(screen.getByText("Login", { selector: "button" }))

    // make sure we get the expected username and page elements
    await screen.findByText(/Baz Le Quux/)
    await screen.findByText("Logout", { selector: "a" })
  })

  it("presents a helpful error when the user enters the wrong password", async () => {
    Auth.signIn.mockRejectedValue(new Error("Incorrect username or password."))
    const state = createState({ notAuthenticated: true })
    const store = createStore(state)
    renderApp(store)

    // confirm that it appears user is not logged in
    expect(
      screen.queryByText("Logout", { selector: "a" })
    ).not.toBeInTheDocument()
    screen.getByText(/Latest news/)
    screen.getByText(/Sinopia Version \d+.\d+.\d+ highlights/)
    screen.getByText("Sinopia help site", { selector: "a" })

    // try to login
    fireEvent.change(screen.getByLabelText("User name"), {
      target: { value: "baz.le.quux@example.edu" },
    })
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password1" },
    })
    fireEvent.click(screen.getByText("Login", { selector: "button" }))

    // an error message should be presented
    await screen.findByText(/Incorrect username or password./)
  })
})
