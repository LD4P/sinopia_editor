// Copyright 2020 Stanford University see LICENSE for license

import { createReducer, setCurrentComponent } from "reducers/index"
import { createState } from "stateUtils"

const reducers = {
  SET_CURRENT_COMPONENT: setCurrentComponent,
}
const reducer = createReducer(reducers)

describe("createReducer", () => {
  it("handles the initial state", () => {
    const oldState = {}
    const reducer = createReducer({})
    const action = {}

    const newState = reducer(oldState, action)

    expect(newState).toMatchObject({})
  })
})

describe("setCurrentComponent()", () => {
  describe("when modal closed", () => {
    it("sets current component", () => {
      const oldState = createState()

      const action = {
        type: "SET_CURRENT_COMPONENT",
        payload: {
          rootSubjectKey: "CxGx7WMh2",
          rootPropertyKey: "DyGx7WMh3",
          key: "EzGx7WMh4",
        },
      }

      const newState = reducer(oldState.editor, action)
      expect(newState.currentComponent.CxGx7WMh2).toStrictEqual({
        component: "EzGx7WMh4",
        property: "DyGx7WMh3",
      })
    })
  })

  describe("when modal open", () => {
    it("does not set current component", () => {
      const oldState = createState()
      oldState.editor.currentModal = ["GroupChoiceModal"]

      const action = {
        type: "SET_CURRENT_COMPONENT",
        payload: {
          rootSubjectKey: "CxGx7WMh2",
          rootPropertyKey: "DyGx7WMh3",
          key: "EzGx7WMh4",
        },
      }

      const newState = reducer(oldState.editor, action)
      expect(newState.currentComponent).toStrictEqual({})
    })
  })
})
