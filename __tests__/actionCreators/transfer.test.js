// Copyright 2019 Stanford University see LICENSE for license
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import * as sinopiaApi from "sinopiaApi"
import { createState } from "stateUtils"
import { transfer } from "actionCreators/transfer"

const mockStore = configureMockStore([thunk])

const resourceUri =
  "https://api.development.sinopia.io/resource/7b4c275d-b0c7-40a4-80b3-e95a0d9d987c"

describe("transfer", () => {
  describe("successful", () => {
    it("dispatches actions to add user", async () => {
      sinopiaApi.postTransfer = jest.fn().mockResolvedValue()
      const store = mockStore(createState())
      await store.dispatch(
        transfer(resourceUri, "stanford", "ils", "testerrorkey")
      )

      expect(store.getActions()).toHaveLength(0)
      expect(sinopiaApi.postTransfer).toHaveBeenCalledWith(
        resourceUri,
        "stanford",
        "ils"
      )
    })
  })
  describe("failure", () => {
    it("dispatches actions to remove user", async () => {
      sinopiaApi.postTransfer = jest.fn().mockRejectedValue("Ooops!")
      const store = mockStore(createState())
      await store.dispatch(
        transfer(resourceUri, "stanford", "ils", "testerrorkey")
      )

      expect(store.getActions()).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error: "Error requesting transfer: Ooops!",
      })
    })
  })
})
