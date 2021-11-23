// Copyright 2019 Stanford University see LICENSE for license

import { showModal, hideModal, showLangModal } from "reducers/modals"
import { createState } from "stateUtils"
import { createReducer } from "reducers/index"

const reducers = {
  HIDE_MODAL: hideModal,
  SHOW_MODAL: showModal,
  SHOW_LANG_MODAL: showLangModal,
}

const reducer = createReducer(reducers)

describe("showModal and hideModal for RDFModal", () => {
  it("updates state to add modal", () => {
    const oldState = createState()
    oldState.editor.currentLangModalValue = "wihOjn-0Z"

    const action = {
      type: "SHOW_MODAL",
      payload: "RDFModal",
    }

    const newState = reducer(oldState.editor, action)

    expect(newState.currentModal).toBe("RDFModal")
    expect(newState.currentLangModalValue).toBe(null)
  })

  it("updates state to remove modal", () => {
    const oldState = createState()
    oldState.editor.currentModal = "RDFModal"
    oldState.editor.currentLangModalValue = "wihOjn-0Z"

    const action = {
      type: "HIDE_MODAL",
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentModal).toBe(null)
    expect(newState.currentLangModalValue).toBe(null)
  })
})

describe("showLangModal", () => {
  it("updates state to add modal and value", () => {
    const oldState = createState()
    oldState.editor.currentLangModalValue = "wihOjn-0Z"

    const action = {
      type: "SHOW_LANG_MODAL",
      payload: "wihOjn-0Z",
    }

    const newState = reducer(oldState.editor, action)

    expect(newState.currentModal).toBe("LangModal")
    expect(newState.currentLangModalValue).toBe("wihOjn-0Z")
  })
})
