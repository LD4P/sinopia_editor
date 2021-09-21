import {
  loadUserData,
  addTemplateHistory,
  addResourceHistory,
  addSearchHistory,
} from "actionCreators/user"
import * as sinopiaApi from "sinopiaApi"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"
import * as sinopiaSearch from "sinopiaSearch"

const mockStore = configureMockStore([thunk])

describe("loadUserData()", () => {
  it("fetches from Sinopia API and dispatches", async () => {
    sinopiaApi.fetchUser = jest.fn().mockResolvedValue({
      data: {
        history: {
          template: [{ id: "abc123", payload: "template1" }],
          resource: [
            {
              id: "def456",
              payload:
                "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
            },
          ],
          search: [
            {
              id: "ghi789",
              payload: JSON.stringify({
                query: "dracula",
                authorityUri: "urn:ld4p:sinopia",
              }),
            },
          ],
        },
      },
    })
    sinopiaSearch.getTemplateSearchResultsByIds = jest
      .fn()
      .mockResolvedValue({ results: [{ id: "template1" }] })
    sinopiaSearch.getSearchResultsByUris = jest.fn().mockResolvedValue({
      results: [
        {
          uri: "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
        },
      ],
    })
    const store = mockStore(createState())

    await store.dispatch(loadUserData("ekostova"))
    const actions = store.getActions()

    expect(actions).toHaveAction("ADD_TEMPLATE_HISTORY_BY_RESULT", {
      id: "template1",
    })
    expect(actions).toHaveAction("ADD_RESOURCE_HISTORY_BY_RESULT", {
      uri: "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
    })
    expect(actions).toHaveAction("ADD_SEARCH_HISTORY", {
      authorityUri: "urn:ld4p:sinopia",
      authorityLabel: "Sinopia resources",
      query: "dracula",
    })

    expect(sinopiaApi.fetchUser).toHaveBeenCalledWith("ekostova")
    expect(sinopiaSearch.getTemplateSearchResultsByIds).toHaveBeenCalledWith([
      "template1",
    ])
  })
})

describe("addTemplateHistory()", () => {
  it("sends to API", async () => {
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())

    await store.dispatch(addTemplateHistory("template1"))

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
      "Foo McBar",
      "template",
      "5860e2660bd44eab2be5190cd2cafb8b",
      "template1"
    )
  })
})

describe("addResourceHistory()", () => {
  it("sends to API", async () => {
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())

    await store.dispatch(
      addResourceHistory(
        "https://api.development.sinopia.io/resource/3f90a592-5070-4244-a2d9-47f503329e39"
      )
    )

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
      "Foo McBar",
      "resource",
      "b7d41ce2cdf71bd8dd3198b93d5bb7bd",
      "https://api.development.sinopia.io/resource/3f90a592-5070-4244-a2d9-47f503329e39"
    )
  })
})

describe("addSearchHistory()", () => {
  it("sends to API", async () => {
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    const store = mockStore(createState())

    await store.dispatch(addSearchHistory("sinopia", "ants"))

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
      "Foo McBar",
      "search",
      "dd5b5cc7ca199ba76faf047ffb52575d",
      '{"authorityUri":"sinopia","query":"ants"}'
    )
  })
})
