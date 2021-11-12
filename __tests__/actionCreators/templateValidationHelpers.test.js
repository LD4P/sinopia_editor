import { validateTemplates } from "actionCreators/templateValidationHelpers"
import Config from "Config"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { createState } from "stateUtils"
import ResourceBuilder from "resourceBuilderUtils"

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

const build = new ResourceBuilder()
const mockStore = configureMockStore([thunk])

describe("validateTemplates()", () => {
  describe("a valid template", () => {
    const subjectTemplate = build.subjectTemplate({
      id: "resourceTemplate:bf2:Title",
      clazz: "http://id.loc.gov/ontologies/bibframe/Title",
      label: "Instance Title",
      remark:
        "Title information relating to a resource: work title, preferred title, instance title, transcribed title, translated title, variant form of title, etc.",
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "resourceTemplate:bf2:Title",
          label: "Title Proper (RDA 2.3.2) (BIBFRAME: Main title)",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/mainTitle": "Main title",
          },
          repeatable: true,
          type: "literal",
          component: "InputLiteral",
        }),
        build.propertyTemplate({
          subjectTemplateKey: "resourceTemplate:bf2:Title",
          label: "Other Title Information (RDA 2.3.4) (BIBFRAME: Subtitle)",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/subtitle": "Subtitle",
          },
          repeatable: true,
          type: "literal",
          component: "InputLiteral",
        }),
        build.propertyTemplate({
          subjectTemplateKey: "resourceTemplate:bf2:Title",
          label: "Part number",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/partNumber": "Part number",
          },
          repeatable: true,
          type: "literal",
          component: "InputLiteral",
        }),
        build.propertyTemplate({
          subjectTemplateKey: "resourceTemplate:bf2:Title",
          label: "Part name",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/partName": "Part name",
          },
          repeatable: true,
          type: "literal",
          component: "InputLiteral",
        }),
        build.propertyTemplate({
          subjectTemplateKey: "resourceTemplate:bf2:Title",
          label: "Note on title",
          uris: { "http://id.loc.gov/ontologies/bibframe/note": "Note" },
          repeatable: true,
          type: "resource",
          component: "NestedResource",
          valueSubjectTemplateKeys: ["resourceTemplate:bf2:Title:Note"],
        }),
      ],
    })

    it("returns no errors", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(true)
      expect(store.getActions()).toHaveAction("ADD_TEMPLATES")
      expect(store.getActions()).not.toHaveAction("ADD_ERROR")
    })
  })

  describe("template with bad subject template", () => {
    const subjectTemplate = {
      key: undefined,
      id: undefined,
      class: undefined,
      label: undefined,
      author: "LD4P",
      remark: undefined,
      date: "2019-08-19",
      propertyTemplateKeys: [],
      propertyTemplates: [],
    }

    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload1 = {
        errorKey: "testerrorkey",
        error: "Resource template id is missing from resource template.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload1)
      const payload2 = {
        errorKey: "testerrorkey",
        error: "Resource template class is missing from resource template.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload2)
      const payload3 = {
        errorKey: "testerrorkey",
        error: "Resource template label is missing from resource template.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload3)
    })
  })

  describe("template with property template missing propertyURI", () => {
    const subjectTemplate = build.subjectTemplate({
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      clazz: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
          label: "Property missing URIs",
          // These will be removed below.
          uris: { "http://id.loc.gov/ontologies/bibframe/temp": "Temporary" },
          type: "literal",
          component: "InputLiteral",
        }),
      ],
    })
    subjectTemplate.propertyTemplates[0].uris = undefined
    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload = {
        errorKey: "testerrorkey",
        error: "Property template URI is required.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload)
    })
  })

  describe("template with bad property template", () => {
    const subjectTemplate = build.subjectTemplate({
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      clazz: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
          label: "Temporary",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/mainTitle": "Main title",
          },
          type: "literal",
          component: "InputLiteral",
        }),
      ],
    })

    subjectTemplate.propertyTemplates[0].label = undefined
    subjectTemplate.propertyTemplates[0].type = null
    subjectTemplate.propertyTemplates[0].component = null
    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload1 = {
        errorKey: "testerrorkey",
        error:
          "Property template label is required for http://id.loc.gov/ontologies/bibframe/mainTitle.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload1)
      const payload2 = {
        errorKey: "testerrorkey",
        error:
          "Cannot determine type for http://id.loc.gov/ontologies/bibframe/mainTitle. Must be resource, lookup, or literal.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload2)
      const payload3 = {
        errorKey: "testerrorkey",
        error:
          "Cannot determine component for http://id.loc.gov/ontologies/bibframe/mainTitle.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload3)
    })
  })

  describe("template with missing authority configs", () => {
    const subjectTemplate = build.subjectTemplate({
      id: "test:resource:SinopiaLookup",
      clazz: "http://id.loc.gov/ontologies/bibframe/Instance",
      label: "Testing sinopia lookup",
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "test:resource:SinopiaLookup",
          label: "Instance of (lookup)",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/instanceOf": "Instance of",
          },
          required: true,
          type: "uri",
          component: "InputLookup",
          authorities: [{ uri: "xurn:ld4p:sinopia:bibframe:instance" }],
        }),
      ],
    })

    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload = {
        errorKey: "testerrorkey",
        error:
          "Misconfigured authority xurn:ld4p:sinopia:bibframe:instance for http://id.loc.gov/ontologies/bibframe/instanceOf.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload)
    })
  })

  describe("template with repeated properties", () => {
    const subjectTemplate = build.subjectTemplate({
      id: "rt:repeated:propertyURI:propertyLabel",
      clazz: "http://id.loc.gov/ontologies/bibframe/Work",
      label: "repeated propertyURI with differing propertyLabel",
      author: "michelle",
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "rt:repeated:propertyURI:propertyLabel",
          label: "Geographic Coverage 1",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/geographicCoverage":
              "Geographic coverage",
          },
          repeatable: true,
          remark: "tooltip 1",
          type: "literal",
          component: "InputLiteral",
        }),
        build.propertyTemplate({
          subjectTemplateKey: "rt:repeated:propertyURI:propertyLabel",
          label: "Geographic Coverage 2",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/geographicCoverage":
              "Geographic coverage",
          },
          repeatable: true,
          remark: "tooltip 2",
          type: "literal",
          component: "InputLiteral",
        }),
      ],
    })

    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload = {
        errorKey: "testerrorkey",
        error:
          "Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload)
    })
  })

  describe("template with missing resource templates", () => {
    const subjectTemplate = build.subjectTemplate({
      id: "test:RT:bf2:notFoundValueTemplateRefs",
      clazz: "http://id.loc.gov/ontologies/bibframe/Identifier",
      label: "Not found value template refs",
      author: "Justin Littman",
      date: "2019-08-19",
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "test:RT:bf2:notFoundValueTemplateRefs",
          label: "Barcode",
          uris: { "http://id.loc.gov/ontologies/bibframe/Barcode": "Barcode" },
          repeatable: true,
          type: "resource",
          component: "NestedResource",
          valueSubjectTemplateKeys: ["lc:RT:bf2:Identifiers:Barcode"],
        }),
        build.propertyTemplate({
          subjectTemplateKey: "test:RT:bf2:notFoundValueTemplateRefs",
          label: "Copyright Registration Number",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/CopyrightRegistration":
              "Copyright registration",
          },
          repeatable: true,
          type: "resource",
          component: "NestedResource",
          valueSubjectTemplateKeys: ["lc:RT:bf2:Identifiers:Copyright"],
        }),
      ],
    })

    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload = {
        errorKey: "testerrorkey",
        error:
          "The following referenced resource templates are not available in Sinopia: lc:RT:bf2:Identifiers:Barcode, lc:RT:bf2:Identifiers:Copyright",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload)
    }, 10000)
  })

  describe("template with non-unique property template refs", () => {
    const subjectTemplate = build.subjectTemplate({
      id: "test:RT:bf2:RareMat:Instance",
      clazz: "http://id.loc.gov/ontologies/bibframe/Instance",
      label: "Value template refs with non-unique resource URIs",
      author: "LD4P",
      remark: "based on LC template ld4p:RT:bf2:RareMat:Instance",
      date: "2019-08-19",
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "test:RT:bf2:RareMat:Instance",
          label: "Form of Instance",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/genreForm": "Genre form",
          },
          repeatable: true,
          type: "resource",
          component: "NestedResource",
          valueSubjectTemplateKeys: [
            "ld4p:RT:bf2:Form",
            "ld4p:RT:bf2:RareMat:RBMS",
          ],
        }),
      ],
    })

    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload = {
        errorKey: "testerrorkey",
        error:
          "The following resource templates references for http://id.loc.gov/ontologies/bibframe/genreForm have the same class (http://id.loc.gov/ontologies/bibframe/GenreForm), but must be unique: ld4p:RT:bf2:Form, ld4p:RT:bf2:RareMat:RBMS",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload)
    })
  })

  describe("a valid suppressible template", () => {
    const subjectTemplate = build.subjectTemplate({
      uri: "http://localhost:3000/resource/pcc:bf2:Agent:Person",
      id: "pcc:bf2:Agent:Person",
      clazz: "http://id.loc.gov/ontologies/bibframe/Person",
      label: "Agent--Person",
      author: "PCC",
      date: "2020-09-20",
      suppressible: true,
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "pcc:bf2:Agent:Person",
          label: "Name of Person",
          uris: { "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Value" },
          repeatable: true,
          authorities: [
            {
              uri: "urn:ld4p:qa:names",
              label: "LOC all names (QA)",
              authority: "locnames_ld4l_cache",
              subauthority: "",
              nonldLookup: false,
            },
          ],
          type: "uri",
          component: "InputLookup",
        }),
      ],
    })

    it("returns no errors", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(true)
      expect(store.getActions()).not.toHaveAction("ADD_ERROR")
    })
  })

  describe("a suppressible template with wrong number of property templates", () => {
    const subjectTemplate = build.subjectTemplate({
      uri: "http://localhost:3000/resource/pcc:bf2:Agent:Person",
      id: "pcc:bf2:Agent:Person",
      clazz: "http://id.loc.gov/ontologies/bibframe/Person",
      label: "Agent--Person",
      author: "PCC",
      date: "2020-09-20",
      suppressible: true,
    })

    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload = {
        errorKey: "testerrorkey",
        error: "A suppressible template must have one property template.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload)
    })
  })

  describe("a suppressible template with wrong type of property", () => {
    const subjectTemplate = build.subjectTemplate({
      uri: "http://localhost:3000/resource/pcc:bf2:Agent:Person",
      id: "pcc:bf2:Agent:Person",
      clazz: "http://id.loc.gov/ontologies/bibframe/Person",
      label: "Agent--Person",
      author: "PCC",
      date: "2020-09-20",
      suppressible: true,
      propertyTemplates: [
        build.propertyTemplate({
          subjectTemplateKey: "pcc:bf2:Agent:Person",
          label: "Name of Person",
          uris: { "http://www.w3.org/1999/02/22-rdf-syntax-ns#value": "Value" },
          repeatable: true,
          type: "literal",
          component: "InputLiteral",
        }),
      ],
    })

    it("returns error", async () => {
      const store = mockStore(createState())

      expect(
        await store.dispatch(
          validateTemplates(subjectTemplate, {}, "testerrorkey")
        )
      ).toBe(false)
      const payload = {
        errorKey: "testerrorkey",
        error:
          "The property for a suppressible template must be a URI or lookup.",
      }
      expect(store.getActions()).toHaveAction("ADD_ERROR", payload)
    })
  })
})
