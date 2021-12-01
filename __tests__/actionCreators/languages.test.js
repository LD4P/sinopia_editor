// Copyright 2019 Stanford University see LICENSE for license

import { fetchLanguages } from "actionCreators/languages"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"

const mockStore = configureMockStore([thunk])

describe("fetchLanguages", () => {
  const store = mockStore(createState({ noLanguage: true }))

  it("dispatches actions", async () => {
    await store.dispatch(fetchLanguages())
    const actions = store.getActions()
    expect(actions).toHaveLength(1)
    const action = actions[0]
    expect(action.type).toEqual("LANGUAGES_RECEIVED")
    const {
      languages,
      languageLookup,
      scripts,
      scriptLookup,
      transliterations,
      transliterationLookup,
    } = action.payload

    expect(languages.taw).toEqual("Tai")
    expect(languages.en).toEqual("English")
    expect(languages.eng).toEqual("English")

    expect(languageLookup).toContainEqual({ id: "taw", label: "Tai (taw)" })
    expect(languageLookup).toContainEqual({ id: "en", label: "English (en)" })

    expect(scripts.Adlm).toEqual("Adlam")
    expect(scripts.Latn).toEqual("Latin")

    expect(scriptLookup).toContainEqual({ id: "Adlm", label: "Adlam (Adlm)" })
    expect(scriptLookup).toContainEqual({ id: "Latn", label: "Latin (Latn)" })

    expect(transliterations.alaloc).toEqual(
      "American Library Association-Library of Congress"
    )
    expect(transliterations.buckwalt).toEqual(
      "Buckwalter Arabic transliteration system"
    )

    expect(transliterationLookup).toContainEqual({
      id: "alaloc",
      label: "American Library Association-Library of Congress (alaloc)",
    })
    expect(transliterationLookup).toContainEqual({
      id: "buckwalt",
      label: "Buckwalter Arabic transliteration system (buckwalt)",
    })
  })
})
