import {
  expandProperty,
  addSiblingValueSubject,
  saveNewResource,
  saveResource,
  contractProperty,
} from "actionCreators/resources"
import mockConsole from "jest-mock-console"
import * as sinopiaApi from "sinopiaApi"
import * as sinopiaSearch from "sinopiaSearch"
import Config from "Config"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"
import { nanoid } from "nanoid"
import FakeTimers from "@sinonjs/fake-timers"
import { safeAction } from "actionUtils"
import expectedExpandPropertyAddValueAction from "../__action_fixtures__/expandProperty-ADD_VALUE"
import expectedExpandPropertyAddPropertyAction from "../__action_fixtures__/expandProperty-ADD_PROPERTY"
import expectedAddSiblingAddValueAction from "../__action_fixtures__/addSiblingValueSubject-ADD_VALUE"

// This won't be required after Jest 27
jest.useFakeTimers("modern")
jest.mock("nanoid")

let clock
// Support mocking/restoring the `console` object
let restoreConsole = null
beforeEach(() => {
  nanoid.mockImplementation(() => "abc123")
  clock = FakeTimers.install({ now: new Date("2020-08-20T11:34:40.887Z") })
  // Capture and not display console output
  restoreConsole = mockConsole(["error", "debug"])
})

afterAll(() => {
  clock.uninstall()
  restoreConsole()
})

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

const mockStore = configureMockStore([thunk])

describe("expandProperty", () => {
  describe("expand a nested resource", () => {
    // const expectedAddValueAction = require("../__action_fixtures__/expandProperty-ADD_VALUE.json")
    const store = mockStore(
      createState({ hasResourceWithContractedNestedResource: true })
    )

    it("dispatches actions", async () => {
      await store.dispatch(expandProperty("v1o90QO1Qx", "testerrorkey"))

      const actions = store.getActions()

      const addValueAction = actions.find(
        (action) => action.type === "ADD_VALUE"
      )

      expect(safeAction(addValueAction)).toEqual(
        expectedExpandPropertyAddValueAction
      )

      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("SHOW_PROPERTY", "v1o90QO1Qx")
    })
  })

  describe("expand a literal", () => {
    const store = mockStore(
      createState({ hasResourceWithContractedLiteral: true })
    )

    it("dispatches actions", async () => {
      await store.dispatch(expandProperty("JQEtq-vmq8", "testerrorkey"))

      const actions = store.getActions()

      const addPropertyAction = actions.find(
        (action) => action.type === "ADD_PROPERTY"
      )

      expect(safeAction(addPropertyAction)).toEqual(
        expectedExpandPropertyAddPropertyAction
      )

      expect(actions).toHaveAction("SHOW_PROPERTY", "JQEtq-vmq8")
    })
  })
})

describe("addSiblingValueSubject", () => {
  const store = mockStore(createState({ hasResourceWithNestedResource: true }))

  it("dispatches actions", async () => {
    await store.dispatch(addSiblingValueSubject("VDOeQCnFA8", "testerrorkey"))

    const actions = store.getActions()

    const addValueAction = actions.find((action) => action.type === "ADD_VALUE")
    expect(safeAction(addValueAction)).toEqual(expectedAddSiblingAddValueAction)
  })
})

describe("saveNewResource", () => {
  const uri = "http://localhost:3000/resource/abcdeghij23455"
  sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
  sinopiaSearch.getSearchResultsByUris = jest
    .fn()
    .mockResolvedValue({ results: [] })

  it("saves a new resource", async () => {
    const store = mockStore(createState({ hasResourceWithLiteral: true }))
    sinopiaApi.postResource = jest.fn().mockResolvedValue(uri)

    await store.dispatch(
      saveNewResource("t9zVwg2zO", "stanford", ["cornell"], "testerror")
    )

    const actions = store.getActions()

    expect(actions).toHaveAction("CLEAR_ERRORS")
    expect(actions).toHaveAction("SET_BASE_URL")
    expect(actions).toHaveAction("SAVE_RESOURCE_FINISHED")
    expect(actions).toHaveAction("ADD_RESOURCE_HISTORY", {
      resourceUri: uri,
      modified: "2020-08-20T11:34:40.887Z",
      group: "stanford",
      type: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
    })
    expect(actions).toHaveAction("SET_RESOURCE_GROUP", {
      resourceKey: "t9zVwg2zO",
      group: "stanford",
      editGroups: ["cornell"],
    })

    const saveResourceFinishedAction = actions.find(
      (action) => action.type === "SAVE_RESOURCE_FINISHED"
    )
    expect(saveResourceFinishedAction.payload.resourceKey).toEqual("t9zVwg2zO")

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
      "Foo McBar",
      "resource",
      "bf59d4921535b8f951f1db52584c6d6e",
      "http://localhost:3000/resource/abcdeghij23455"
    )
  })

  it("error when saving a new resource", async () => {
    const store = mockStore(createState({ hasResourceWithLiteral: true }))
    sinopiaApi.postResource.mockRejectedValue(new Error("Messed-up"))

    await store.dispatch(
      saveNewResource("t9zVwg2zO", "stanford", ["cornell"], "testerror")
    )

    const actions = store.getActions()

    expect(actions).toHaveAction("ADD_ERROR", {
      errorKey: "testerror",
      error: "Error saving new resource: Messed-up",
    })
  })
})

describe("saveResource", () => {
  sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
  sinopiaSearch.getSearchResultsByUris = jest
    .fn()
    .mockResolvedValue({ results: [] })

  it("saves an existing resource", async () => {
    sinopiaApi.putResource = jest.fn().mockResolvedValue("t9zVwg2zO")
    const state = createState({ hasResourceWithLiteral: true })
    state.entities.subjects.t9zVwg2zO.group = "stanford"
    const store = mockStore(state)

    await store.dispatch(
      saveResource("t9zVwg2zO", "stanford", ["cornell"], "testerror")
    )
    const actions = store.getActions()

    expect(actions).toHaveAction("CLEAR_ERRORS")
    expect(actions).toHaveAction("SAVE_RESOURCE_FINISHED")
    expect(actions).toHaveAction("ADD_RESOURCE_HISTORY", {
      resourceUri: "https://api.sinopia.io/resource/0894a8b3",
      type: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      group: "stanford",
      modified: "2020-08-20T11:34:40.887Z",
    })
    expect(actions).toHaveAction("SET_RESOURCE_GROUP", {
      resourceKey: "t9zVwg2zO",
      group: "stanford",
      editGroups: ["cornell"],
    })

    expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
      "Foo McBar",
      "resource",
      "3eb9f1444e9ec984fb165fc9c4de826a",
      "https://api.sinopia.io/resource/0894a8b3"
    )
  })

  it("error when trying to save existing resource", async () => {
    sinopiaApi.putResource = jest.fn().mockRejectedValue(new Error("Messed-up"))
    const store = mockStore(createState({ hasResourceWithLiteral: true }))
    await store.dispatch(
      saveResource("t9zVwg2zO", "stanford", ["cornell"], "testerror")
    )
    const actions = store.getActions()
    expect(actions).toHaveAction("ADD_ERROR", {
      errorKey: "testerror",
      error: "Error saving: Messed-up",
    })
  })
})

describe("contractProperty", () => {
  const store = mockStore(createState({ hasResourceWithLiteral: true }))

  it("removes a property values from state", async () => {
    await store.dispatch(contractProperty("JQEtq-vmq8"))
    const actions = store.getActions()
    expect(actions).toHaveAction("ADD_PROPERTY")
  })
})
