// Copyright 2019 Stanford University see LICENSE for license
import { authenticate, signIn, signOut } from "actionCreators/authenticate"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import Auth from "@aws-amplify/auth"
import * as sinopiaApi from "sinopiaApi"

jest.mock("@aws-amplify/auth")

const mockStore = configureMockStore([thunk])

const userData = {
  data: { history: { template: [], resource: [], search: [] } },
}

describe("authenticate", () => {
  describe("user already in state", () => {
    it("does not authenticate", async () => {
      const store = mockStore({
        authenticate: { user: { username: "havram" } },
      })
      await store.dispatch(authenticate())
      expect(store.getActions()).toEqual([])
    })
  })
  describe("successful", () => {
    sinopiaApi.fetchUser = jest.fn().mockResolvedValue(userData)
    it("dispatches actions to add user", async () => {
      Auth.currentAuthenticatedUser.mockResolvedValue({
        username: "havram",
        something: "else",
        signInUserSession: {
          idToken: { payload: { "cognito:groups": ["loc"] } },
        },
      })
      const store = mockStore({ authenticate: { user: undefined } })
      await store.dispatch(authenticate())
      expect(store.getActions()).toHaveAction("SET_USER", {
        username: "havram",
        groups: ["loc"],
      })
      expect(sinopiaApi.fetchUser).toHaveBeenCalledWith("havram")
    })
  })
  describe("failure", () => {
    it("dispatches actions to remove user", async () => {
      Auth.currentAuthenticatedUser.mockRejectedValue()
      const store = mockStore({ authenticate: { user: undefined } })
      await store.dispatch(authenticate())
      expect(store.getActions()).toHaveAction("REMOVE_USER")
    })
  })
})

describe("signIn", () => {
  describe("successful", () => {
    sinopiaApi.fetchUser = jest.fn().mockResolvedValue(userData)
    it("dispatches actions to add user", async () => {
      Auth.signIn.mockResolvedValue({
        username: "havram",
        something: "else",
        signInUserSession: {
          idToken: { payload: { "cognito:groups": ["loc"] } },
        },
      })
      const store = mockStore()
      await store.dispatch(signIn("havram", "m&rc", "testerrorkey"))

      expect(Auth.signIn).toHaveBeenCalledWith("havram", "m&rc")
      expect(store.getActions()).toHaveAction("SET_USER", {
        username: "havram",
        groups: ["loc"],
      })
      expect(sinopiaApi.fetchUser).toHaveBeenCalledWith("havram")
    })
  })
  describe("failure", () => {
    it("dispatches actions to remove user", async () => {
      Auth.signIn.mockRejectedValue(new Error("Bad user"))
      const store = mockStore()
      await store.dispatch(signIn("mdewey", "amh&rst", "testerrorkey"))

      expect(store.getActions()).toHaveAction("CLEAR_ERRORS", "testerrorkey")
      expect(store.getActions()).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error: "Login failed: Bad user",
      })
      expect(store.getActions()).toHaveAction("REMOVE_USER")
    })
  })
})

describe("signOut", () => {
  describe("successful", () => {
    it("dispatches actions to remove user", async () => {
      Auth.signOut.mockResolvedValue()
      const store = mockStore()
      await store.dispatch(signOut())

      expect(Auth.signOut).toHaveBeenCalled()
      expect(store.getActions()).toHaveAction("REMOVE_USER")
    })
  })
  describe("failure", () => {
    it("does nothing", async () => {
      Auth.signOut.mockRejectedValue()
      const store = mockStore()
      await store.dispatch(signOut())

      expect(store.getActions()).toEqual([])
    })
  })
})
