// Copyright 2019 Stanford University see LICENSE for license

import {
  showModal,
  hideModal,
  showLangModal,
  showMarcModal,
} from "reducers/modals"
import { createState } from "stateUtils"
import { createReducer } from "reducers/index"

const reducers = {
  HIDE_MODAL: hideModal,
  SHOW_MODAL: showModal,
  SHOW_LANG_MODAL: showLangModal,
  SHOW_MARC_MODAL: showMarcModal,
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

    expect(newState.currentModal).toEqual(["RDFModal"])
    expect(newState.currentLangModalValue).toBe(null)
  })

  it("appends when modal already open", () => {
    const oldState = createState()
    oldState.editor.currentModal = ["PreviewModal"]

    const action = {
      type: "SHOW_MODAL",
      payload: "RDFModal",
    }

    const newState = reducer(oldState.editor, action)

    expect(newState.currentModal).toEqual(["PreviewModal", "RDFModal"])
  })

  it("updates state to remove modal", () => {
    const oldState = createState()
    oldState.editor.currentModal = ["RDFModal"]
    oldState.editor.currentLangModalValue = "wihOjn-0Z"

    const action = {
      type: "HIDE_MODAL",
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentModal).toEqual([])
    expect(newState.currentLangModalValue).toBe(null)
  })

  it("updates state to pop last modal", () => {
    const oldState = createState()
    oldState.editor.currentModal = ["PreviewModal", "RDFModal"]

    const action = {
      type: "HIDE_MODAL",
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentModal).toEqual(["PreviewModal"])
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

    expect(newState.currentModal).toEqual(["LangModal"])
    expect(newState.currentLangModalValue).toBe("wihOjn-0Z")
  })
})

describe("showModal and hideModal for MarcModal", () => {
  it("updates state to add modal", () => {
    const oldState = createState()

    const action = {
      type: "SHOW_MARC_MODAL",
      payload: "A MARC record.",
    }

    const newState = reducer(oldState.editor, action)

    expect(newState.currentModal).toEqual(["MarcModal"])
    expect(newState.marc).toEqual("A MARC record.")
  })

  it("updates state to remove modal", () => {
    const oldState = createState()
    oldState.editor.currentModal = ["MarcModal"]
    oldState.editor.marc = "A MARC record."

    const action = {
      type: "HIDE_MODAL",
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentModal).toEqual([])
    expect(newState.marc).toBe(null)
  })
})
