import {
  loadRelationships,
  loadSearchRelationships,
} from "actionCreators/relationships"
import * as sinopiaApi from "sinopiaApi"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"

const mockStore = configureMockStore([thunk])

const relationships = {
  bfAdminMetadataInferredRefs: [
    "http://localhost:3000/resource/72f2f457-31f5-432c-8acf-b4037f7754g",
  ],
  bfItemInferredRefs: [],
  bfInstanceInferredRefs: [],
  bfWorkInferredRefs: [
    "http://localhost:3000/resource/83f2f457-31f5-432c-8acf-b4037f7754h",
  ],
  bfAdminMetadataRefs: [
    "http://localhost:3000/resource/94f2f457-31f5-432c-8acf-b4037f7754i",
  ],
  bfItemRefs: [
    "http://localhost:3000/resource/05f2f457-31f5-432c-8acf-b4037f7754j",
  ],
  bfInstanceRefs: [],
  bfWorkRefs: [],
  sinopiaLocalAdminMetadataForRefs: [],
  sinopiaHasLocalAdminMetadataInferredRefs: [],
  bfAdminMetadataAllRefs: [
    "http://localhost:3000/resource/72f2f457-31f5-432c-8acf-b4037f7754g",
    "http://localhost:3000/resource/94f2f457-31f5-432c-8acf-b4037f7754i",
  ],
  bfItemAllRefs: [
    "http://localhost:3000/resource/05f2f457-31f5-432c-8acf-b4037f7754j",
  ],
  bfInstanceAllRefs: [],
  bfWorkAllRefs: [
    "http://localhost:3000/resource/83f2f457-31f5-432c-8acf-b4037f7754h",
  ],
  id: "c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
}

describe("loadRelationships()", () => {
  beforeEach(() => {
    sinopiaApi.fetchResourceRelationships = jest
      .fn()
      .mockResolvedValue(relationships)
  })

  it("fetches from Sinopia API and dispatches", async () => {
    const store = mockStore(createState())

    await store.dispatch(
      loadRelationships(
        "7d7d-40ac-b38e",
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
        "testerrorkey"
      )
    )
    const actions = store.getActions()

    expect(actions).toHaveLength(2)

    expect(actions).toHaveAction("CLEAR_ERRORS")

    expect(actions).toHaveAction("SET_RELATIONSHIPS", {
      resourceKey: "7d7d-40ac-b38e",
      relationships: {
        bfAdminMetadataRefs: [
          "http://localhost:3000/resource/72f2f457-31f5-432c-8acf-b4037f7754g",
        ],
        bfItemRefs: [],
        bfInstanceRefs: [],
        bfWorkRefs: [
          "http://localhost:3000/resource/83f2f457-31f5-432c-8acf-b4037f7754h",
        ],
      },
    })

    expect(sinopiaApi.fetchResourceRelationships).toHaveBeenCalledWith(
      "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
    )
  })

  describe("when an error", () => {
    beforeEach(() => {
      sinopiaApi.fetchResourceRelationships = jest
        .fn()
        .mockRejectedValue("Ooops")
    })

    it("dispatches error", async () => {
      const store = mockStore(createState())

      await store.dispatch(
        loadRelationships(
          "7d7d-40ac-b38e",
          "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
          "testerrorkey"
        )
      )
      const actions = store.getActions()

      expect(actions).toHaveLength(2)

      expect(actions).toHaveAction("CLEAR_ERRORS")

      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error:
          "Error retrieving relationships for http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f: Ooops",
      })
    })
  })
})

describe("loadSearchRelationships()", () => {
  beforeEach(() => {
    sinopiaApi.fetchResourceRelationships = jest
      .fn()
      .mockResolvedValue(relationships)
  })

  it("fetches from Sinopia API and dispatches", async () => {
    const store = mockStore(createState())

    await store.dispatch(
      loadSearchRelationships(
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
        "testerrorkey"
      )
    )
    const actions = store.getActions()

    expect(actions).toHaveLength(1)

    expect(actions).toHaveAction("SET_SEARCH_RELATIONSHIPS", {
      uri: "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
      relationships: {
        bfItemRefs: [
          "http://localhost:3000/resource/05f2f457-31f5-432c-8acf-b4037f7754j",
        ],
        bfInstanceRefs: [],
        bfWorkRefs: [
          "http://localhost:3000/resource/83f2f457-31f5-432c-8acf-b4037f7754h",
        ],
      },
    })

    expect(sinopiaApi.fetchResourceRelationships).toHaveBeenCalledWith(
      "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
    )
  })

  describe("when an error", () => {
    beforeEach(() => {
      sinopiaApi.fetchResourceRelationships = jest
        .fn()
        .mockRejectedValue("Ooops")
    })

    it("dispatches error", async () => {
      const store = mockStore(createState())

      await store.dispatch(
        loadSearchRelationships(
          "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
          "testerrorkey"
        )
      )
      const actions = store.getActions()

      expect(actions).toHaveLength(1)

      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error:
          "Error retrieving relationships for http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f: Ooops",
      })
    })
  })
})
