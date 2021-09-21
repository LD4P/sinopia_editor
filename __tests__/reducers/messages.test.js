// Copyright 2020 Stanford University see LICENSE for license

import { showCopyNewMessage } from "reducers/messages"
import { createReducer } from "reducers/index"

describe("showCopyNewMessage()", () => {
  const handlers = { SHOW_COPY_NEW_MESSAGE: showCopyNewMessage }
  const reducer = createReducer(handlers)

  it("copies new message when payload has an URI", () => {
    const oldState = {
      copyToNewMessage: {},
    }
    const action = {
      type: "SHOW_COPY_NEW_MESSAGE",
      payload: {
        oldUri: "https://sinopia.io/stanford/1234",
        timestamp: 1594667068562,
      },
    }

    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      copyToNewMessage: {
        timestamp: 1594667068562,
        oldUri: "https://sinopia.io/stanford/1234",
      },
    })
  })
})
