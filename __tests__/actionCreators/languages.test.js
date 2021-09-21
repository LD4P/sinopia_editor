// Copyright 2019 Stanford University see LICENSE for license

import { fetchLanguages } from "actionCreators/languages"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"

const mockStore = configureMockStore([thunk])

describe("fetchLanguages", () => {
  const mockSuccessResponse = { languages: [{ label: "French" }] }
  const mockJsonPromise = Promise.resolve(mockSuccessResponse)
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  })

  const store = mockStore(createState({ noLanguage: true }))

  global.fetch = jest.fn().mockImplementation(() => mockFetchPromise)

  it("dispatches actions", async () => {
    await store.dispatch(fetchLanguages())
    const actions = store.getActions()
    expect(actions).toEqual([
      { type: "LANGUAGES_RECEIVED", payload: mockSuccessResponse },
    ])
  })
})
