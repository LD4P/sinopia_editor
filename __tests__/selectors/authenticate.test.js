// Copyright 2019 Stanford University see LICENSE for license

import { hasUser, selectUser } from "selectors/authenticate"

const stateWithUser = {
  authenticate: {
    user: {
      username: "jfoo",
    },
  },
}

const stateWithoutUser = {
  authenticate: {},
}

describe("hasUser()", () => {
  describe("when there is a user", () => {
    it("returns true", () => {
      expect(hasUser(stateWithUser)).toBe(true)
    })
  })
  describe("when no user", () => {
    it("returns false", () => {
      expect(hasUser(stateWithoutUser)).toBe(false)
    })
  })
})

describe("selectUser()", () => {
  it("returns user", () => {
    expect(selectUser(stateWithUser)).toEqual({
      username: "jfoo",
    })
  })
})
