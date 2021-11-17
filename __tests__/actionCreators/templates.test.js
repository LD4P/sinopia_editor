import { loadResourceTemplate } from "actionCreators/templates"
import Config from "Config"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

const mockStore = configureMockStore([thunk])

describe("loadResourceTemplate()", () => {
  describe("a valid template", () => {
    it("returns templates and dispatches actions when loaded", async () => {
      const store = mockStore(createState())

      const subjectTemplate = await store.dispatch(
        loadResourceTemplate("ld4p:RT:bf2:Title:AbbrTitle", {}, "testerrorkey")
      )
      expect(subjectTemplate).toBeSubjectTemplate("ld4p:RT:bf2:Title:AbbrTitle")
      expect(subjectTemplate.propertyTemplates).toHaveLength(1)
      expect(subjectTemplate.propertyTemplates[0]).toBePropertyTemplate(
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      )

      expect(store.getActions()).toEqual([
        {
          type: "ADD_TEMPLATES",
          payload: expect.toBeSubjectTemplate("ld4p:RT:bf2:Title:AbbrTitle"),
        },
      ])
    })
  })

  describe("a template already in state", () => {
    it("returns templates", async () => {
      const store = mockStore(createState({ hasResourceWithLiteral: true }))

      const subjectTemplate = await store.dispatch(
        loadResourceTemplate("ld4p:RT:bf2:Title:AbbrTitle", {}, "testerrorkey")
      )
      expect(subjectTemplate).toBeSubjectTemplate("ld4p:RT:bf2:Title:AbbrTitle")
      expect(subjectTemplate.propertyTemplates).toHaveLength(1)
      expect(subjectTemplate.propertyTemplates[0]).toBePropertyTemplate(
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      )

      expect(store.getActions()).toHaveLength(0)
    })
  })

  describe("an invalid template", () => {
    it("dispatches errors and returns empty", async () => {
      const store = mockStore(createState({ hasResourceWithLiteral: true }))

      const subjectTemplate = await store.dispatch(
        loadResourceTemplate(
          "rt:repeated:propertyURI:propertyLabel",
          {},
          "testerrorkey"
        )
      )
      expect(subjectTemplate).toBeNull()

      expect(store.getActions()).toEqual([
        {
          type: "ADD_TEMPLATES",
          payload: expect.toBeSubjectTemplate(
            "rt:repeated:propertyURI:propertyLabel"
          ),
        },
        {
          type: "ADD_ERROR",
          payload: {
            errorKey: "testerrorkey",
            error:
              "A property template may not use the same property URI as another property template (http://id.loc.gov/ontologies/bibframe/geographicCoverage) unless both propery templates are of type nested resource and the nested resources are of different classes.",
          },
        },
      ])
    })
  })

  describe("an error retrieving the template", () => {
    it("dispatches errors and returns empty", async () => {
      const store = mockStore(createState({ hasResourceWithLiteral: true }))

      const subjectTemplate = await store.dispatch(
        loadResourceTemplate("ld4p:RT:bf2:xxx", {}, "testerrorkey")
      )
      expect(subjectTemplate).toBeNull()

      expect(store.getActions()).toEqual([
        {
          type: "ADD_ERROR",
          payload: {
            errorKey: "testerrorkey",
            error:
              "Error retrieving ld4p:RT:bf2:xxx: Error parsing resource: Error retrieving resource: Not Found",
          },
        },
      ])
    })
  })
})
