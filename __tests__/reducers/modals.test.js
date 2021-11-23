// Copyright 2019 Stanford University see LICENSE for license

import { showModal, hideModal } from "reducers/modals"
import { createState } from "stateUtils"
import { createReducer } from "reducers/index"

const reducers = {
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

    expect(newState.currentModal).toBe("RDFModal")
  })

  it("sets the showRdfPreview to false", () => {
    const oldState = createState()
    oldState.editor.currentModal = "RDFModal"

    const action = {
      type: "HIDE_MODAL",
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentModal).toBe(null)
  })
})
