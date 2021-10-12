// Copyright 2020 Stanford University see LICENSE for license

import { createReducer } from "reducers/index"

describe("createReducer", () => {
  it("handles the initial state", () => {
    const oldState = {}
    const reducer = createReducer({})
    const action = {}

    const newState = reducer(oldState, action)

    expect(newState).toMatchObject({})
  })
})
