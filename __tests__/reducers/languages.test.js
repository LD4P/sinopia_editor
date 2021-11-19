// Copyright 2020 Stanford University see LICENSE for license

import { languagesReceived, setLanguage } from "reducers/languages"

import { createReducer } from "reducers/index"
import { createState } from "stateUtils"

const reducers = {
  LANGUAGE_SELECTED: setLanguage,
  LANGUAGES_RECEIVED: languagesReceived,
}
const reducer = createReducer(reducers)

describe("setLanguage", () => {
  it("sets value language", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const subjectKey = oldState.entities.properties["JQEtq-vmq8"].subjectKey
    expect(oldState.entities.subjects[subjectKey].changed).toBeFalsy

    const action = {
      type: "LANGUAGE_SELECTED",
      payload: {
        valueKey: "CxGx7WMh2",
        lang: "spa",
      },
    }

    const newState = reducer(oldState.entities, action)
    expect(newState.values.CxGx7WMh2.lang).toBe("spa")
    expect(newState.subjects[subjectKey].changed).toBeTruthy
  })
})
