// Copyright 2020 Stanford University see LICENSE for license

import { languagesReceived, setLanguage } from "reducers/languages"

import { createReducer } from "reducers/index"
import { createState } from "stateUtils"

const reducers = {
  LANGUAGE_SELECTED: setLanguage,
  LANGUAGES_RECEIVED: languagesReceived,
}
const reducer = createReducer(reducers)

describe("languagesReceived()", () => {
  it("creates a hash of options that it renders in the form field", () => {
    const lcLanguage = [
      {
        "@id": "http://id.loc.gov/vocabulary/iso639-2/sna",
        "http://www.loc.gov/mads/rdf/v1#authoritativeLabel": [
          {
            "@language": "en",
            "@value": "Shona",
          },
        ],
      },
      {
        "@id": "http://id.loc.gov/vocabulary/languages/oops",
      },
    ]

    const oldState = {
      languages: [],
    }

    const action = {
      type: "LANGUAGES_RECEIVED",
      payload: lcLanguage,
    }

    const newState = reducer(oldState, action)
    expect(newState).toEqual({
      languageLookup: [{ id: "sna", label: "Shona" }],
      languages: { sna: "Shona" },
    })
  })
})

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
