import {
  loadResourceForEditor,
  loadResourceForPreview,
  loadResourceForDiff,
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
import * as relationshipActionCreators from "actionCreators/relationships"
import expectedAction from "../__action_fixtures__/loadResource-ADD_SUBJECT"
import expectedMultiplePropertyUrisAction from "../__action_fixtures__/loadResource-ADD_SUBJECT-multiple-property-uris"
import { safeAction, cloneAddResourceActionAsNewResource } from "actionUtils"

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

const uri =
  "http://localhost:3000/resource/b6c5f4c0-e7cd-4ca5-a20f-2a37fe1080d6"

describe("loadResource", () => {
  describe("loading a resource for editor", () => {
    const store = mockStore(createState())
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    sinopiaSearch.getSearchResultsByUris = jest
      .fn()
      .mockResolvedValue({ results: [] })
    jest.spyOn(relationshipActionCreators, "loadRelationships")

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        loadResourceForEditor(uri, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(addSubjectAction).not.toBeNull()
      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(expectedAction)

      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("SET_UNUSED_RDF")
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE")
      expect(actions).toHaveAction("LOAD_RESOURCE_FINISHED")
      expect(actions).toHaveAction("ADD_RESOURCE_HISTORY", {
        resourceUri: uri,
        type: "http://sinopia.io/testing/Inputs",
        group: "stanford",
        modified: "2020-08-20T11:34:40.887Z",
      })

      expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
        "Foo McBar",
        "resource",
        "87d27b05d48874c9f80cd4b7e8fc0dcc",
        uri
      )

      // loadRelationships is invoked async and do not wait for results
      expect(relationshipActionCreators.loadRelationships).toHaveBeenCalledWith(
        "abc123",
        uri,
        "testerrorkey"
      )
    })
  })

  describe("loading a new resource", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        loadResourceForEditor(uri, "testerrorkey", {
          asNewResource: true,
        })
      )
      expect(result).toBe(true)

      const actions = store.getActions()
      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(addSubjectAction).not.toBeNull()

      const newExpectedAction =
        cloneAddResourceActionAsNewResource(expectedAction)

      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(newExpectedAction)

      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("ADD_SUBJECT")
      expect(actions).toHaveAction("SET_UNUSED_RDF")
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE")
      expect(actions).toHaveAction("SET_CURRENT_COMPONENT", {
        rootSubjectKey: "abc123",
        rootPropertyKey: "abc123",
        key: "abc123",
      })
      expect(actions).not.toHaveAction("LOAD_RESOURCE_FINISHED")
    })
  })

  describe("loading a resource for preview", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        loadResourceForPreview(uri, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()
      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("SET_UNUSED_RDF")
      expect(actions).toHaveAction("SET_CURRENT_PREVIEW_RESOURCE")
    })
  })

  describe("loading a resource for diff", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        loadResourceForDiff(uri, "testerrorkey", "compareFromResourceKey", {
          version: "2019-10-16T17:13:45.084Z",
        })
      )
      expect(result).toBe(true)

      const actions = store.getActions()
      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("SET_UNUSED_RDF")
      expect(actions).toHaveAction("SET_CURRENT_DIFF_RESOURCES", {
        compareFromResourceKey: "abc123",
      })
    })
  })

  describe("loading an invalid resource", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid"
      const result = await store.dispatch(
        loadResourceForEditor(uri, "testerrorkey")
      )
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error:
          "A property template may not use the same property URI as another property template (http://id.loc.gov/ontologies/bibframe/geographicCoverage) unless both propery templates are of type nested resource and the nested resources are of different classes.",
      })
    })
  })

  describe("loading a resource without a resource template", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid-template"
      const result = await store.dispatch(
        loadResourceForEditor(uri, "testerrorkey")
      )
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error:
          "Error retrieving http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid-template: A single resource template must be included as a triple (http://sinopia.io/vocabulary/hasResourceTemplate)",
      })
    })
  })

  describe("load error", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      // http://error is a special URI that will cause an error to be thrown.
      const result = await store.dispatch(
        loadResourceForEditor("http://error", "testerrorkey")
      )
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error: "Error retrieving http://error: Error parsing resource: Ooops",
      })
    })
  })

  describe("loading a resource with multiple property uris", () => {
    const uri =
      "http://localhost:3000/resource/c7c5f4c0-e7cd-4ca5-a20f-2a37fe1080d7"
    const store = mockStore(createState())
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    sinopiaSearch.getSearchResultsByUris = jest
      .fn()
      .mockResolvedValue({ results: [] })
    jest.spyOn(relationshipActionCreators, "loadRelationships")

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        loadResourceForEditor(uri, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(addSubjectAction).not.toBeNull()
      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(
        expectedMultiplePropertyUrisAction
      )
    })
  })
})
