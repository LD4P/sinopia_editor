// Copyright 2019 Stanford University see LICENSE for license
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import * as sinopiaApi from "sinopiaApi"
import { createState } from "stateUtils"
import { transfer, loadLocalIds } from "actionCreators/transfer"
import Config from "Config"

const mockStore = configureMockStore([thunk])

const resourceUri =
  "https://api.development.sinopia.io/resource/7b4c275d-b0c7-40a4-80b3-e95a0d9d987c"

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

describe("transfer", () => {
  describe("successful", () => {
    it("dispatches actions to add user", async () => {
      sinopiaApi.postTransfer = jest.fn().mockResolvedValue()
      const store = mockStore(createState())
      await store.dispatch(
        transfer(resourceUri, "stanford", "FOLIO", "abc123", "testerrorkey")
      )

      expect(store.getActions()).toHaveLength(0)
      expect(sinopiaApi.postTransfer).toHaveBeenCalledWith(
        resourceUri,
        "stanford",
        "FOLIO",
        "abc123"
      )
    })
  })

  describe("transfer failure", () => {
    it("dispatches actions to remove user", async () => {
      sinopiaApi.postTransfer = jest.fn().mockRejectedValue("Ooops!")
      const store = mockStore(createState())
      await store.dispatch(
        transfer(resourceUri, "stanford", "", "abc123", "testerrorkey")
      )

      expect(store.getActions()).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error: "Error requesting transfer: Ooops!",
      })
    })
  })

  describe("loadLocalIds()", () => {
    it("dispatches actions to set local id", async () => {
      const store = mockStore(createState())
      await store.dispatch(
        loadLocalIds(
          "abc123",
          [
            "http://localhost:3000/resource/ae93cff4-d272-43b2-a4ee-fb8651907e51",
          ],
          "testerrorkey"
        )
      )

      const actions = store.getActions()

      expect(actions).toHaveAction("CLEAR_LOCAL_IDS", "abc123")
      expect(actions).toHaveAction("SET_LOCAL_ID", {
        resourceKey: "abc123",
        target: "SIRSI",
        group: "stanford",
        localId: "13714202",
      })
    })
  })
})
