import {
  newResourceFromDataset,
  loadResourceForEditor,
  loadResourceForPreview,
  loadResourceForDiff,
  newResource,
  newResourceCopy,
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
import GraphBuilder from "GraphBuilder"
import { datasetFromN3 } from "utilities/Utilities"
import { nanoid } from "nanoid"
import _ from "lodash"
import FakeTimers from "@sinonjs/fake-timers"
import * as relationshipActionCreators from "actionCreators/relationships"

// This won't be required after Jest 27
jest.useFakeTimers("modern")
jest.mock("nanoid")

let clock
beforeEach(() => {
  let counter = 0
  nanoid.mockImplementation(() => `abc${counter++}`)
  clock = FakeTimers.install({ now: new Date("2020-08-20T11:34:40.887Z") })
})

afterAll(() => {
  clock.uninstall()
})

// Support mocking/restoring the `console` object
let restoreConsole = null

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

const mockStore = configureMockStore([thunk])

// This removes circular references.
const safeAction = (action) => JSON.parse(JSON.safeStringify(action))

const cloneAddResourceActionAsNewResource = (addResourceAction) => {
  const clonedAction = _.cloneDeep(addResourceAction)

  clonedAction.payload.uri = null
  clonedAction.payload.group = null
  clonedAction.payload.editGroups = []

  return clonedAction
}

const uri =
  "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
const resourceTemplateId = "resourceTemplate:testing:uber1"

const n3 = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n0 .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n1 .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n2 .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "Uber template1, property2"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property4> "Uber template1, property4"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property5> <ubertemplate1:property5> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6> <ubertemplate1:property6> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<ubertemplate1:property5> <http://www.w3.org/2000/01/rdf-schema#label> "ubertemplate1:property5" .
<ubertemplate1:property6> <http://www.w3.org/2000/01/rdf-schema#label> "ubertemplate1:property6" .
_:b2_c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template3/property1> "Uber template3, property1"@eng .
_:b2_c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template3/property2> "Uber template3, property2"@eng .
_:b2_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber3> .
_:b2_c14n1 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "Uber template2, property1"@eng .
_:b2_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
_:b2_c14n2 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "Uber template2, property1b"@eng .
_:b2_c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property21> <http://sinopia.io/ubertemplate5/property1> .
<http://sinopia.io/ubertemplate5/property1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber5> .
<http://sinopia.io/ubertemplate5/property1> <http://www.w3.org/2000/01/rdf-schema#label> "http://sinopia.io/ubertemplate5/property1" .
`

beforeAll(() => {
  // Capture and not display console output
  restoreConsole = mockConsole(["error", "debug"])
})

afterAll(() => {
  restoreConsole()
})

describe("newResourceFromDataset", () => {
  const expectedAddResourceAction = require("../__action_fixtures__/newResourceFromDataset-ADD_SUBJECT.json")

  describe("loading a resource", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const dataset = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()
      // ADD_TEMPLATES is dispatched numerous times since mock store doesn't update state.
      expect(actions).toHaveAction("ADD_TEMPLATES")

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(addSubjectAction).not.toBeNull()
      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      // URI should be set for resource.
      expect(addSubjectAction.payload.uri).toBe(uri)

      // As a bonus check, roundtrip to RDF.
      const actualRdf = new GraphBuilder(
        addSubjectAction.payload
      ).graph.toCanonical()
      const expectedGraph = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const expectedRdf = expectedGraph.toCanonical()
      expect(actualRdf).toMatch(expectedRdf)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc0",
        rdf: null,
      })
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE", "abc0")
      expect(actions).toHaveAction("LOAD_RESOURCE_FINISHED", "abc0")
    })
  })

  describe("loading a legacy resource (suppressed nested resource that is not suppressed)", () => {
    const n3 = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n0 .
    <> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n1 .
    <> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:b2_c14n2 .
    <> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "Uber template1, property2"@eng .
    <> <http://id.loc.gov/ontologies/bibframe/uber/template1/property4> "Uber template1, property4"@eng .
    <> <http://id.loc.gov/ontologies/bibframe/uber/template1/property5> <ubertemplate1:property5> .
    <> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6> <ubertemplate1:property6> .
    <> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
    <> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
    <ubertemplate1:property5> <http://www.w3.org/2000/01/rdf-schema#label> "ubertemplate1:property5" .
    <ubertemplate1:property6> <http://www.w3.org/2000/01/rdf-schema#label> "ubertemplate1:property6" .
    _:b2_c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template3/property1> "Uber template3, property1"@eng .
    _:b2_c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template3/property2> "Uber template3, property2"@eng .
    _:b2_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber3> .
    _:b2_c14n1 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "Uber template2, property1"@eng .
    _:b2_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
    _:b2_c14n2 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "Uber template2, property1b"@eng .
    _:b2_c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
    <> <http://id.loc.gov/ontologies/bibframe/uber/template1/property21> _:b2_c14n3 .
    _:b2_c14n3 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber5> .
    _:b2_c14n3 <http://id.loc.gov/ontologies/bibframe/uber/template5/property1> <http://sinopia.io/ubertemplate5/property1> .
    `

    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const dataset = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()
      // ADD_TEMPLATES is dispatched numerous times since mock store doesn't update state.
      expect(actions).toHaveAction("ADD_TEMPLATES")

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(addSubjectAction).not.toBeNull()
      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      // URI should be set for resource.
      expect(addSubjectAction.payload.uri).toBe(uri)

      // Roundtripped RDF should NOT match.
      const actualRdf = new GraphBuilder(
        addSubjectAction.payload
      ).graph.toCanonical()
      const expectedGraph = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const expectedRdf = expectedGraph.toCanonical()
      expect(actualRdf).not.toMatch(expectedRdf)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc0",
        rdf: null,
      })
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE", "abc0")
      expect(actions).toHaveAction("LOAD_RESOURCE_FINISHED", "abc0")
    })
  })

  describe("loading a legacy resource (<> as root)", () => {
    // Legacy resources have <> as the root resource rather than <[uri]>.
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const dataset = await datasetFromN3(n3)
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)
    })
  })

  describe("loading a resource with extra triples", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const extraRdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6x> <ubertemplate1:property6> .
<x> <http://id.loc.gov/ontologies/bibframe/uber/template1/property6> <ubertemplate1:property6> .
`
      const dataset = await datasetFromN3(n3 + extraRdf)
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc0",
        rdf: extraRdf,
      })
    })
  })

  describe("loading a resource with extra label triple", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const extraRdf = `<ubertemplate1:property5> <http://www.w3.org/2000/01/rdf-schema#label> "http://sinopia.io/ubertemplate1:property5" .
`
      const dataset = await datasetFromN3(n3 + extraRdf)
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc0",
        rdf: null,
      })
    })
  })

  describe("loading a resource with more than one quad for ordered property", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const extraRdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property19> _:b1.
_:b1 a <http://id.loc.gov/ontologies/bibframe/Uber4>;
    <http://id.loc.gov/ontologies/bibframe/uber/template4/property1> "foo"@eng.
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property19> _:b2.
_:b2 a <http://id.loc.gov/ontologies/bibframe/Uber4>;
    <http://id.loc.gov/ontologies/bibframe/uber/template4/property1> "bar"@eng.
`
      const dataset = await datasetFromN3(n3 + extraRdf)
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc0",
        rdf: `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property19> _:c14n0 .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property19> _:c14n1 .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template4/property1> "bar"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber4> .
_:c14n1 <http://id.loc.gov/ontologies/bibframe/uber/template4/property1> "foo"@eng .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber4> .
`,
      })
    })
  })

  describe("loading a new resource", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const dataset = await datasetFromN3(n3.replace(/<>/g, `<${uri}>`))
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey", true)
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )

      // URI should not be set for resource.
      expect(addSubjectAction.payload.uri).toBeNull()

      const newExpectedAddResourceAction = cloneAddResourceActionAsNewResource(
        expectedAddResourceAction
      )
      expect(safeAction(addSubjectAction)).toEqual(newExpectedAddResourceAction)

      // LOAD_RESOURCE_FINISHED marks the resource as unchanged, which isn't wanted when new.
      expect(actions).not.toHaveAction("LOAD_RESOURCE_FINISHED")
    })
  })

  describe("loading a resource with provided resource template id", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      // Change the hasResourceTemplate triple.
      const fixtureRdf = n3.replace(
        resourceTemplateId,
        `${resourceTemplateId}x`
      )
      const dataset = await datasetFromN3(fixtureRdf)
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, resourceTemplateId, "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)
    })
  })

  describe("loading a resource with errors", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const fixtureRdf = n3.replace(
        resourceTemplateId,
        "rt:repeated:propertyURI:propertyLabel"
      )
      const dataset = await datasetFromN3(fixtureRdf)
      const result = await store.dispatch(
        newResourceFromDataset(dataset, uri, null, "testerrorkey")
      )
      expect(result).toBe(false)

      const actions = store.getActions()
      expect(actions).toHaveAction("ADD_ERROR", {
        errorKey: "testerrorkey",
        error:
          "Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.",
      })
    })
  })
})

describe("loadResource", () => {
  describe("loading a resource for editor", () => {
    const expectedAddResourceAction = require("../__action_fixtures__/loadResource-ADD_SUBJECT.json")
    const store = mockStore(createState())
    sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()
    sinopiaSearch.getSearchResultsByUris = jest
      .fn()
      .mockResolvedValue({ results: [] })
    jest.spyOn(relationshipActionCreators, "loadRelationships")

    it("dispatches actions", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
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
      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("SET_UNUSED_RDF")
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE")
      expect(actions).toHaveAction("LOAD_RESOURCE_FINISHED")
      expect(actions).toHaveAction("ADD_RESOURCE_HISTORY", {
        resourceUri:
          "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
        type: "http://id.loc.gov/ontologies/bibframe/Uber1",
        group: "stanford",
        modified: "2020-08-20T11:34:40.887Z",
      })

      expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
        "Foo McBar",
        "resource",
        "fa69abf421c862f9a62aa2192c61caa8",
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
      )

      // loadRelationships is invoked async and do not wait for results
      expect(relationshipActionCreators.loadRelationships).toHaveBeenCalledWith(
        "abc0",
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f",
        "testerrorkey"
      )
    })
  })

  describe("loading a new resource", () => {
    const expectedAddResourceAction = require("../__action_fixtures__/loadResource-ADD_SUBJECT.json")
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
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

      const newExpectedAddResourceAction = cloneAddResourceActionAsNewResource(
        expectedAddResourceAction
      )

      // safeStringify is used because it removes circular references
      expect(safeAction(addSubjectAction)).toEqual(newExpectedAddResourceAction)

      expect(actions).toHaveAction("CLEAR_ERRORS")
      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("ADD_SUBJECT")
      expect(actions).toHaveAction("SET_UNUSED_RDF")
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE")
      expect(actions).toHaveAction("SET_CURRENT_COMPONENT", {
        rootSubjectKey: "abc0",
        rootPropertyKey: "abc1",
        key: "abc1",
      })
      expect(actions).not.toHaveAction("LOAD_RESOURCE_FINISHED")
    })
  })

  describe("loading a resource for preview", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
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
      const uri =
        "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"
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
        compareFromResourceKey: "abc0",
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
          "Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.",
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

  describe("load resource with nested resource", () => {
    const store = mockStore(createState())
    const expectedAddResourceNestedResourceAction = require("../__action_fixtures__/loadResourceNestedResource-ADD_SUBJECT.json")
    it("should have nested resources from loading resource and templates", async () => {
      const uri =
        "http://localhost:3000/resource/a4181509-8046-47c8-9327-6e576c517d70"
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
        expectedAddResourceNestedResourceAction
      )
    })
  })
})

describe("newResource", () => {
  const expectedAddResourceAction = require("../__action_fixtures__/newResource-ADD_SUBJECT.json")
  sinopiaApi.putUserHistory = jest.fn().mockResolvedValue()

  describe("loading from resource template", () => {
    const store = mockStore(createState())

    it("dispatches actions", async () => {
      const result = await store.dispatch(
        newResource("resourceTemplate:testing:uber1", "testerrorkey")
      )
      expect(result).toBe(true)

      const actions = store.getActions()
      // ADD_TEMPLATES is dispatched numerous times since mock store doesn't update state.
      expect(actions).toHaveAction("ADD_TEMPLATES")

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )

      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc0",
        rdf: null,
      })
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE", "abc0")
      expect(actions).toHaveAction("LOAD_RESOURCE_FINISHED", "abc0")
      expect(actions).toHaveAction("ADD_TEMPLATE_HISTORY")
      expect(actions).toHaveAction("SET_CURRENT_COMPONENT", {
        rootSubjectKey: "abc0",
        rootPropertyKey: "abc1",
        key: "abc1",
      })
      expect(sinopiaApi.putUserHistory).toHaveBeenCalledWith(
        "Foo McBar",
        "template",
        "be206d7f3a5b9ba621c6f66aef2858a8",
        "resourceTemplate:testing:uber1"
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
          "Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.",
      })
    })
  })
})

describe("newResourceCopy", () => {
  const expectedAddResourceAction = require("../__action_fixtures__/newResourceCopy-ADD_SUBJECT.json")

  describe("loading from existing resource", () => {
    const store = mockStore(createState({ hasResourceWithLiteral: true }))

    it("dispatches actions", async () => {
      await store.dispatch(newResourceCopy("t9zVwg2zO"))

      const actions = store.getActions()

      const addSubjectAction = actions.find(
        (action) => action.type === "ADD_SUBJECT"
      )

      expect(safeAction(addSubjectAction)).toEqual(expectedAddResourceAction)

      expect(actions).toHaveAction("SET_UNUSED_RDF", {
        resourceKey: "abc0",
        rdf: null,
      })
      expect(actions).toHaveAction("SET_CURRENT_EDIT_RESOURCE", "abc0")
      expect(actions).toHaveAction("SET_CURRENT_COMPONENT", {
        rootSubjectKey: "abc0",
        rootPropertyKey: "abc1",
        key: "abc1",
      })
    })
  })
})

describe("expandProperty", () => {
  describe("expand a nested resource", () => {
    const expectedAddValueAction = require("../__action_fixtures__/expandProperty-ADD_VALUE.json")
    const store = mockStore(
      createState({ hasResourceWithContractedNestedResource: true })
    )

    it("dispatches actions", async () => {
      await store.dispatch(expandProperty("v1o90QO1Qx", "testerrorkey"))

      const actions = store.getActions()

      const addValueAction = actions.find(
        (action) => action.type === "ADD_VALUE"
      )

      expect(safeAction(addValueAction)).toEqual(expectedAddValueAction)

      expect(actions).toHaveAction("ADD_TEMPLATES")
      expect(actions).toHaveAction("SHOW_PROPERTY", "v1o90QO1Qx")
    })
  })

  describe("expand a literal", () => {
    const expectedAddPropertyAction = require("../__action_fixtures__/expandProperty-ADD_PROPERTY.json")
    const store = mockStore(
      createState({ hasResourceWithContractedLiteral: true })
    )

    it("dispatches actions", async () => {
      await store.dispatch(expandProperty("JQEtq-vmq8", "testerrorkey"))

      const actions = store.getActions()

      const addPropertyAction = actions.find(
        (action) => action.type === "ADD_PROPERTY"
      )

      expect(safeAction(addPropertyAction)).toEqual(expectedAddPropertyAction)

      expect(actions).toHaveAction("SHOW_PROPERTY", "JQEtq-vmq8")
    })
  })
})

describe("addSiblingValueSubject", () => {
  const expectedAddValueAction = require("../__action_fixtures__/addSiblingValueSubject-ADD_VALUE.json")
  const store = mockStore(createState({ hasResourceWithNestedResource: true }))

  it("dispatches actions", async () => {
    await store.dispatch(addSiblingValueSubject("VDOeQCnFA8", "testerrorkey"))

    const actions = store.getActions()

    const addValueAction = actions.find((action) => action.type === "ADD_VALUE")
    expect(safeAction(addValueAction)).toEqual(expectedAddValueAction)
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
