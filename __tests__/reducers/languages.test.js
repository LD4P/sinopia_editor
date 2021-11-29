// Copyright 2020 Stanford University see LICENSE for license

import {
  languagesReceived,
  setLanguage,
  setDefaultLang,
} from "reducers/languages"

import { createReducer } from "reducers/index"
import { createState } from "stateUtils"

const reducers = {
  LANGUAGE_SELECTED: setLanguage,
  LANGUAGES_RECEIVED: languagesReceived,
  SET_DEFAULT_LANG: setDefaultLang,
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

describe("setDefaultLang", () => {
  it("sets default language on root subject and values", () => {
    const oldState = createState({ hasResourceWithTwoNestedResources: true })
    oldState.entities.values["pRJ0lO_mU-"].literal = null

    const action = {
      type: "SET_DEFAULT_LANG",
      payload: {
        resourceKey: "ljAblGiBW",
        lang: "spa",
      },
    }

    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.ljAblGiBW.defaultLang).toBe("spa")
    expect(newState.values["pRJ0lO_mU-"].lang).toBe("spa")
    expect(newState.values["pRJ0lO_mT-"].lang).toBe("en")
  })
})
