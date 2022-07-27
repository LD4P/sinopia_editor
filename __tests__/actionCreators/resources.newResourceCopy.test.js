import { newResourceCopy } from "actionCreators/resources"
import mockConsole from "jest-mock-console"
import Config from "Config"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"
import { nanoid } from "nanoid"
import expectedAction from "../__action_fixtures__/newResourceCopy-ADD_SUBJECT"
import { safeAction } from "actionUtils"

// This won't be required after Jest 27
jest.useFakeTimers({ now: new Date("2020-08-20T11:34:40.887Z") })
jest.mock("nanoid")

// Support mocking/restoring the `console` object
let restoreConsole = null
beforeEach(() => {
  nanoid.mockImplementation(() => "abc123")
  // Capture and not display console output
  restoreConsole = mockConsole(["error", "debug"])
})

afterAll(() => {
  jest.useRealTimers()
  restoreConsole()
})

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

const mockStore = configureMockStore([thunk])

describe("newResourceCopy", () => {
  describe("loading from existing resource", () => {
    const store = mockStore(createState({ hasResourceWithLiteral: true }))

    it("dispatches actions", async () => {
      await store.dispatch(newResourceCopy("t9zVwg2zO"))

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )

      expect(safeAction(addSubjectAction)).toEqual(expectedAction)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc123",
        rdf: null,
      })
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE", "abc123")
      expect(actions).toHaveAction("SET_CURRENT_COMPONENT", {
        rootSubjectKey: "abc123",
        rootPropertyKey: "abc123",
        key: "abc123",
      })
    })
  })
})
