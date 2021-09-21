// Copyright 2018 Stanford University see LICENSE for license
import { setUser, removeUser } from "reducers/authenticate"

describe("setUser()", () => {
  it("adds user to state", () => {
    const state = {
      user: undefined,
    }
    expect(setUser(state, { payload: { username: "jfoo" } })).toEqual({
      user: {
        username: "jfoo",
      },
    })
  })
})

describe("removeUser()", () => {
  it("removes user from state", () => {
    const state = {
      user: {
        username: "jfoo",
      },
    }
    expect(removeUser(state)).toEqual({})
  })
})
