// Copyright 2020 Stanford University see LICENSE for license
import { exportsReceived } from "reducers/exports"
import { createReducer } from "reducers/index"
import { createState } from "stateUtils"

const handlers = {
  EXPORTS_RECEIVED: exportsReceived,
}
const reducer = createReducer(handlers)

describe("exportsReceived", () => {
  const exportFilenames = [
    "alberta_2020-08-23T00:01:15.272Z.zip",
    "boulder_2020-08-23T00:01:14.781Z.zip",
  ]

  it("sets the list of export file names", () => {
    const action = {
      type: "EXPORTS_RECEIVED",
      payload: exportFilenames,
    }

    const oldState = createState()
    const newState = reducer(oldState.entities, action)
    expect(newState).toMatchObject({
      exports: exportFilenames,
    })
  })
})
