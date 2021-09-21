// Copyright 2019 Stanford University see LICENSE for license

import {
  showModal,
  hideModal,
  clearModalMessages,
  addModalMessage,
} from "reducers/modals"
import { createState } from "stateUtils"
import { createReducer } from "reducers/index"

const reducers = {
  ADD_MODAL_MESSAGE: addModalMessage,
  CLEAR_MODAL_MESSAGES: clearModalMessages,
  HIDE_MODAL: hideModal,
  SHOW_MODAL: showModal,
}

const reducer = createReducer(reducers)

describe("showModal and hideModal for RDFModal", () => {
  it("sets the showRdfPreview to true", () => {
    const oldState = createState()

    const action = {
      type: "SHOW_MODAL",
      payload: "RDFModal",
    }

    const newState = reducer(oldState.editor, action)

    expect(newState.modal.name).toBe("RDFModal")
  })

  it("sets the showRdfPreview to false", () => {
    const oldState = createState()
    oldState.editor.modal.name = "RDFModal"

    const action = {
      type: "HIDE_MODAL",
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.modal.name).toBe(null)
  })
})

describe("clearModalMessages", () => {
  it("sets the showRdfPreview to true", () => {
    const oldState = createState()
    oldState.editor.modal.messages = ["hello"]

    const action = {
      type: "CLEAR_MODAL_MESSAGES",
    }

    const newState = reducer(oldState.editor, action)

    expect(newState.modal.messages).toEqual([])
  })
})

describe("addModalMessage()", () => {
  const action = {
    type: "ADD_MODAL_MESSAGE",
    payload: "An exciting new message",
  }

  it("adds message with no existing messages", () => {
    const oldState = createState()

    const newState = reducer(oldState.editor, action)

    expect(newState.modal.messages).toEqual(["An exciting new message"])
  })

  it("adds message with existing messages", () => {
    const oldState = createState()
    oldState.editor.modal.messages = ["An existing message"]

    const newState = reducer(oldState.editor, action)
    expect(newState.modal.messages).toEqual([
      "An existing message",
      "An exciting new message",
    ])
  })
})
