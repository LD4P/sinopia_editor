import { newResource } from "actionCreators/resources"
import mockConsole from "jest-mock-console"
import * as sinopiaApi from "sinopiaApi"
import Config from "Config"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"
import { nanoid } from "nanoid"
import FakeTimers from "@sinonjs/fake-timers"
import { safeAction } from "actionUtils"
import expectedAction from "../__action_fixtures__/newResource-ADD_SUBJECT"

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

const resourceTemplateId = "resourceTemplate:testing:inputs"

describe("newResource", () => {
  sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()

  describe("loading from resource template", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        newResource(resourceTemplateId, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()
      // ADD_TEMPLATES is dispatched numerous times since mock store doesn't update state.
      expect(actions).toHaveAction("ADD_TEMPLATES")

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )

      expect(safeAction(addSubjectAction)).toEqual(expectedAction)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc123",
        rdf: null,
      })
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE", "abc123")
      expect(actions).toHaveAction("LOAD_RESOURCE_FINISHED", "abc123")
      expect(actions).toHaveAction("ADD_TEMPLATE_HISTORY")
      expect(actions).toHaveAction("SET_CURRENT_COMPONENT", {
        rootSubjectKey: "abc123",
        rootPropertyKey: "abc123",
        key: "abc123",
      })
      expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
        "Foo McBar",
        "template",
        "e2bb9b57c5d91394dc6f7e1d32d7a97b",
        resourceTemplateId
      )
    })
  })

  describe("loading from invalid resource template", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        newResource("rt:repeated:propertyURI:propertyLabel", "testerrorkey")
      )
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error:
          "A property template may not use the same property URI as another property template (http://id.loc.gov/ontologies/bibframe/geographicCoverage) unless both propery templates are of type nested resource and the nested resources are of different classes.",
      })
    })
  })
})
