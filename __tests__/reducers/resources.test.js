// Copyright 2020 Stanford University see LICENSE for license

import {
  addProperty,
  addSubject,
  addValue,
  clearResource,
  hideNavProperty,
  hideNavSubject,
  hideProperty,
  removeSubject,
  removeValue,
  saveResourceFinished,
  setBaseURL,
  setCurrentEditResource,
  setCurrentPreviewResource,
  setUnusedRDF,
  showNavProperty,
  showNavSubject,
  showProperty,
  loadResourceFinished,
  setResourceGroup,
  setValueOrder,
  clearResourceFromEditor,
  saveResourceFinishedEditor,
  updateValue,
  setCurrentDiffResources,
  setVersions,
  clearVersions,
  setValuePropertyURI,
  setPropertyPropertyURI,
} from "reducers/resources"

import { createState } from "stateUtils"
import { createReducer } from "reducers/index"
import { nanoid } from "nanoid"
import StateResourceBuilder from "stateResourceBuilderUtils"

const reducers = {
  ADD_PROPERTY: addProperty,
  ADD_SUBJECT: addSubject,
  ADD_VALUE: addValue,
  CLEAR_RESOURCE: clearResource,
  CLEAR_VERSIONS: clearVersions,
  HIDE_NAV_PROPERTY: hideNavProperty,
  HIDE_NAV_SUBJECT: hideNavSubject,
  HIDE_PROPERTY: hideProperty,
  LOAD_RESOURCE_FINISHED: loadResourceFinished,
  REMOVE_SUBJECT: removeSubject,
  REMOVE_VALUE: removeValue,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SET_BASE_URL: setBaseURL,
  SET_CURRENT_DIFF_RESOURCES: setCurrentDiffResources,
  SET_PROPERTY_PROPERTY_URI: setPropertyPropertyURI,
  SET_RESOURCE_GROUP: setResourceGroup,
  SET_VALUE_ORDER: setValueOrder,
  SET_VALUE_PROPERTY_URI: setValuePropertyURI,
  SET_VERSIONS: setVersions,
  SHOW_NAV_PROPERTY: showNavProperty,
  SHOW_NAV_SUBJECT: showNavSubject,
  SHOW_PROPERTY: showProperty,
  UPDATE_VALUE: updateValue,
}

const reducer = createReducer(reducers)

const editorReducers = {
  CLEAR_RESOURCE: clearResourceFromEditor,
  SAVE_RESOURCE_FINISHED: saveResourceFinishedEditor,
  SET_CURRENT_EDIT_RESOURCE: setCurrentEditResource,
  SET_CURRENT_PREVIEW_RESOURCE: setCurrentPreviewResource,
  SET_UNUSED_RDF: setUnusedRDF,
}

const editorReducer = createReducer(editorReducers)

jest.mock("nanoid")
nanoid.mockReturnValue("abc123")

const build = new StateResourceBuilder()

describe("addProperty()", () => {
  describe("new property with no values", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: "ADD_PROPERTY",
        payload: {
          key: "vmq88891",
          subject: { key: "t9zVwg2zO" },
          propertyTemplate: {
            key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
          },
          values: [],
          show: true,
          propertyUri: null,
        },
      }
      const newState = reducer(oldState.entities, action)
      expect(newState.properties.vmq88891).toStrictEqual(
        build.property({
          key: "vmq88891",
          subjectKey: "t9zVwg2zO",
          rootSubjectKey: "t9zVwg2zO",
          propertyTemplateKey:
            "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
          valueKeys: ["abc123"],
          show: false,
          rootPropertyKey: "vmq88891",
          labels: ["Abbreviated Title", "Abbreviated Title"],
        })
      )
      // New value added
      expect(newState.values.abc123).toStrictEqual(
        build.value({
          key: "abc123",
          propertyKey: "vmq88891",
          propertyUri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
          lang: "en",
          component: "InputLiteralValue",
          rootSubjectKey: "t9zVwg2zO",
        })
      )
      expect(newState.subjects.t9zVwg2zO.propertyKeys).toContain("vmq88891")
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
    })
  })

  describe("new property with no values and suppressed language", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      oldState.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ].languageSuppressed = true

      const action = {
        type: "ADD_PROPERTY",
        payload: {
          key: "vmq88891",
          subject: { key: "t9zVwg2zO" },
          propertyTemplate: {
            key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
          },
          values: [],
          show: true,
          propertyUri: null,
        },
      }

      const newState = reducer(oldState.entities, action)
      // New value added with no lang
      expect(newState.values.abc123).toStrictEqual(
        build.value({
          key: "abc123",
          propertyKey: "vmq88891",
          propertyUri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
          lang: null,
          component: "InputLiteralValue",
          rootSubjectKey: "t9zVwg2zO",
        })
      )
    })
  })

  describe("existing property with values", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      oldState.entities.properties["JQEtq-vmq8"].showNav = true

      const action = {
        type: "ADD_PROPERTY",
        payload: {
          key: "JQEtq-vmq8",
          subject: { key: "t9zVwg2zO" },
          propertyTemplate: {
            key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
          },
          values: [
            {
              key: "RxGx7WMh4",
              property: { key: "JQEtq-vmq8" },
              literal: "bar",
              lang: "en",
              uri: null,
              label: null,
              valueSubject: null,
            },
          ],
          show: false,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.properties["JQEtq-vmq8"]).toStrictEqual({
        key: "JQEtq-vmq8",
        subjectKey: "t9zVwg2zO",
        rootSubjectKey: "t9zVwg2zO",
        propertyTemplateKey:
          "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
        valueKeys: ["RxGx7WMh4"],
        show: true,
        showNav: true,
        rootPropertyKey: "JQEtq-vmq8",
        descWithErrorPropertyKeys: [],
        descUriOrLiteralValueKeys: ["RxGx7WMh4"],
        labels: ["Abbreviated Title", "Abbreviated Title"],
      })
      expect(newState.subjects.t9zVwg2zO.propertyKeys).toContain("JQEtq-vmq8")
      // Replaces values
      expect(newState.values.RxGx7WMh4).not.toBeUndefined()
      expect(newState.values.CxGx7WMh2).toBeUndefined()
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
    })
  })

  describe("existing lookup property with no values", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLookup: true })

      const action = {
        type: "ADD_PROPERTY",
        payload: {
          key: "i0SAJP-Zhd",
          subject: { key: "wihOjn-0Z" },
          propertyTemplate: {
            key: "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
          },
          values: [],
          show: true,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.properties["i0SAJP-Zhd"]).toStrictEqual({
        key: "i0SAJP-Zhd",
        subjectKey: "wihOjn-0Z",
        rootSubjectKey: "wihOjn-0Z",
        propertyTemplateKey:
          "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
        valueKeys: ["abc123"],
        show: true,
        showNav: false,
        rootPropertyKey: "i0SAJP-Zhd",
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: ["i0SAJP-Zhd"],
        labels: ["Testing sinopia lookup", "Instance of (lookup)"],
      })
      expect(newState.subjects["wihOjn-0Z"].propertyKeys).toContain(
        "i0SAJP-Zhd"
      )
      expect(newState.values["s8-qt3-uu"]).toBeUndefined()
      expect(newState.subjects["wihOjn-0Z"].changed).toBe(true)
      // Removes from bfWorkRefs
      expect(newState.subjects["wihOjn-0Z"].bfWorkRefs).toHaveLength(0)
    })
  })

  describe("lookup property with validation error", () => {
    it("adds error", () => {
      const oldState = createState({ hasResourceWithLookup: true })
      oldState.entities.propertyTemplates[
        "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf"
      ].required = true

      const action = {
        type: "ADD_PROPERTY",
        payload: {
          key: "vmq88891",
          subject: { key: "wihOjn-0Z" },
          propertyTemplate: {
            key: "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
          },
          values: [],
          show: true,
        },
      }
      const newState = reducer(oldState.entities, action)
      expect(newState.properties.vmq88891).toStrictEqual({
        key: "vmq88891",
        subjectKey: "wihOjn-0Z",
        rootSubjectKey: "wihOjn-0Z",
        propertyTemplateKey:
          "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
        valueKeys: ["abc123"],
        show: true,
        showNav: false,
        rootPropertyKey: "vmq88891",
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: ["vmq88891"],
        labels: ["Testing sinopia lookup", "Instance of (lookup)"],
      })

      expect(
        newState.subjects["wihOjn-0Z"].descWithErrorPropertyKeys
      ).toContain("vmq88891")
    })
  })
})

describe("addSubject()", () => {
  describe("new subject with no properties and matching resource key", () => {
    it("updates state", () => {
      const oldState = createState()
      oldState.entities.subjectTemplates[
        "resourceTemplate:bf2:Identifiers:Barcode"
      ] = {
        label: "Barcode",
        class: "http://id.loc.gov/ontologies/bibframe/Barcode",
      }

      const action = {
        type: "ADD_SUBJECT",
        payload: {
          key: "45689df",
          properties: [],
          subjectTemplate: { key: "resourceTemplate:bf2:Identifiers:Barcode" },
          uri: null,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.subjects).toStrictEqual({
        "45689df": {
          key: "45689df",
          propertyKeys: [],
          uri: null,
          rootSubjectKey: "45689df",
          bfAdminMetadataRefs: [],
          bfInstanceRefs: [],
          bfItemRefs: [],
          bfWorkRefs: [],
          localAdminMetadataForRefs: [],
          changed: true,
          classes: ["http://id.loc.gov/ontologies/bibframe/Barcode"],
          group: null,
          editGroups: [],
          subjectTemplateKey: "resourceTemplate:bf2:Identifiers:Barcode",
          descUriOrLiteralValueKeys: [],
          descWithErrorPropertyKeys: [],
          valueSubjectOfKey: null,
          rootPropertyKey: null,
          labels: ["Barcode"],
          label: "Barcode",
          showNav: false,
          defaultLang: "en",
        },
      })
    })
  })

  describe("new subject with no properties and different resource key", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: "ADD_SUBJECT",
        payload: {
          key: "45689df",
          properties: [],
          subjectTemplate: { key: "ld4p:RT:bf2:Title:AbbrTitle" },
          uri: null,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.subjects["45689df"]).toStrictEqual({
        key: "45689df",
        propertyKeys: [],
        uri: null,
        rootSubjectKey: "45689df",
        rootPropertyKey: null,
        bfAdminMetadataRefs: [],
        bfInstanceRefs: [],
        bfItemRefs: [],
        bfWorkRefs: [],
        localAdminMetadataForRefs: [],
        changed: true,
        classes: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: [],
        group: null,
        editGroups: [],
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        valueSubjectOfKey: null,
        labels: ["Abbreviated Title"],
        label: "Abbreviated Title",
        showNav: false,
        defaultLang: "en",
      })
    })
  })

  describe("existing subject with properties", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      oldState.entities.subjects.t9zVwg2zO.showNav = true

      const action = {
        type: "ADD_SUBJECT",
        payload: {
          key: "t9zVwg2zO",
          uri: "https://api.sinopia.io/resource/0894a8b3",
          subjectTemplate: { key: "ld4p:RT:bf2:Title:AbbrTitle" },
          properties: [
            {
              key: "KQEtq-vmq9",
              subject: { key: "t9zVwg2zO" },
              propertyTemplate: {
                key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
              },
              valueKeys: [],
              show: true,
            },
          ],
          changed: false,
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.subjects.t9zVwg2zO).toStrictEqual({
        key: "t9zVwg2zO",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: null,
        valueSubjectOfKey: null,
        descUriOrLiteralValueKeys: [],
        descWithErrorPropertyKeys: [],
        uri: "https://api.sinopia.io/resource/0894a8b3",
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        propertyKeys: ["KQEtq-vmq9"],
        changed: true,
        classes: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
        bfAdminMetadataRefs: [],
        bfInstanceRefs: [],
        bfItemRefs: [],
        bfWorkRefs: [],
        localAdminMetadataForRefs: [],
        group: null,
        editGroups: [],
        labels: ["Abbreviated Title"],
        label: "Abbreviated Title",
        showNav: true,
        defaultLang: "en",
      })
      // Replaces values
      expect(newState.properties["KQEtq-vmq9"]).not.toBeUndefined()
      expect(newState.properties["JQEtq-vmq8"]).toBeUndefined()
    })
  })
})

describe("addValue()", () => {
  const addUriAction = {
    type: "ADD_VALUE",
    payload: {
      value: {
        key: "DxGx7WMh3",
        property: { key: "i0SAJP-Zhd" },
        rootSubjectKey: "wihOjn-0Z",
        literal: null,
        lang: "en",
        uri: "http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749",
        label: "How to Cook Everything",
        valueSubjectKey: null,
        propertyUri: "http://id.loc.gov/ontologies/bibframe/instanceOf",
      },
    },
  }

  describe("new literal value", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            propertyKey: "JQEtq-vmq8",
            literal: "bar",
            lang: "en",
            uri: null,
            label: null,
            valueSubjectKey: null,
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "bar",
        lang: "en",
        uri: null,
        label: null,
        valueSubjectKey: null,
        errors: [],
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("DxGx7WMh3")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).toContain("DxGx7WMh3")
      expect(newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys).toContain(
        "DxGx7WMh3"
      )
    })
  })

  describe("new blank literal value for required property", () => {
    it("updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasError: true,
      })
      oldState.entities.properties = {
        "JQEtq-vmq8": {
          key: "JQEtq-vmq8",
          subjectKey: "t9zVwg2zO",
          rootSubjectKey: "t9zVwg2zO",
          rootPropertyKey: "JQEtq-vmq8",
          propertyTemplateKey:
            "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
          valueKeys: [],
          show: true,
          descUriOrLiteralValueKeys: [],
          descWithErrorPropertyKeys: [],
        },
      }
      oldState.entities.values = []

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        errors: ["Literal required"],
        component: "InputLiteralValue",
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("DxGx7WMh3")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).not.toContain("DxGx7WMh3")
      expect(
        newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys
      ).not.toContain("DxGx7WMh3")
      expect(
        newState.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")
      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain(
        "JQEtq-vmq8"
      )
    })
  })

  describe("new literal value with siblingValueKey", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      oldState.entities.properties["JQEtq-vmq8"].valueKeys = [
        "abc123",
        "def456",
      ]

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "bar",
            lang: "en",
            uri: null,
            label: null,
            valueSubjectKey: null,
          },
          siblingValueKey: "abc123",
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toEqual([
        "abc123",
        "DxGx7WMh3",
        "def456",
      ])
    })
  })

  describe("new blank list value for required property", () => {
    it("updates state", () => {
      const oldState = createState({
        hasResourceWithList: true,
      })
      oldState.entities.propertyTemplates[
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1"
      ].required = true
      oldState.entities.properties.RPaGmJ_8IQi8roZ1oj1uK.valueKeys = []

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "RPaGmJ_8IQi8roZ1oj1uK" },
            literal: null,
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
        rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        literal: null,
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        errors: ["URI required", "Label required"],
      })
      expect(newState.properties.RPaGmJ_8IQi8roZ1oj1uK.valueKeys).toContain(
        "DxGx7WMh3"
      )
      expect(newState.properties.RPaGmJ_8IQi8roZ1oj1uK.show).toBe(true)
      expect(
        newState.properties.RPaGmJ_8IQi8roZ1oj1uK.descUriOrLiteralValueKeys
      ).not.toContain("RPaGmJ_8IQi8roZ1oj1uK")
      expect(
        newState.subjects.FYPd18JgfhSGaeviY7NNu.descUriOrLiteralValueKeys
      ).not.toContain("RPaGmJ_8IQi8roZ1oj1uK")
      expect(
        newState.properties.RPaGmJ_8IQi8roZ1oj1uK.descWithErrorPropertyKeys
      ).toContain("RPaGmJ_8IQi8roZ1oj1uK")
      expect(
        newState.subjects.FYPd18JgfhSGaeviY7NNu.descWithErrorPropertyKeys
      ).toContain("RPaGmJ_8IQi8roZ1oj1uK")
    })
  })

  describe("new rdfs label value for resource subject", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      // change propertyTemplate to be one for rdfs label
      oldState.entities.propertyTemplates = {
        "resourceTemplate:testing:uber1 > http://www.w3.org/2000/01/rdf-schema#label":
          build.propertyTemplate({
            key: "resourceTemplate:testing:uber1 > http://www.w3.org/2000/01/rdf-schema#label",
            subjectTemplateKey: "resourceTemplate:testing:uber1",
            label: "rdfs label",
            uris: { "http://www.w3.org/2000/01/rdf-schema#label": "label" },
            type: "literal",
            component: "InputLiteral",
          }),
      }
      oldState.entities.properties["JQEtq-vmq8"].propertyTemplateKey =
        "resourceTemplate:testing:uber1 > http://www.w3.org/2000/01/rdf-schema#label"

      const labelValue = "resource root subject label value!"
      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: labelValue,
            lang: "en",
            uri: null,
            label: null,
            valueSubjectKey: null,
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: labelValue,
        lang: "en",
        uri: null,
        label: null,
        valueSubjectKey: null,
        errors: [],
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("DxGx7WMh3")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(newState.subjects.t9zVwg2zO.label).toEqual(labelValue)
    })
  })

  describe("existing nested resource value", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithNestedResource: true })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "VDOeQCnFA8",
            property: { key: "v1o90QO1Qx" },
            literal: null,
            lang: null,
            uri: null,
            label: null,
            valueSubject: {
              key: "YPb8jaPW1",
              uri: null,
              subjectTemplate: { key: "resourceTemplate:testing:uber2" },
              properties: [],
            },
          },
        },
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.values.VDOeQCnFA8).toStrictEqual({
        key: "VDOeQCnFA8",
        propertyKey: "v1o90QO1Qx",
        rootSubjectKey: "ljAblGiBW",
        rootPropertyKey: "v1o90QO1Qx",
        literal: null,
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: "YPb8jaPW1",
        errors: [],
      })
      // Replaces subjects
      expect(newState.subjects.YPb8jaPW1).not.toBeUndefined()
      expect(newState.subjects.JXPb8jaPWo).toBeUndefined()
    })
  })

  describe("new uri value that is a bf Work ref", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLookup: true })

      const newState = reducer(oldState.entities, addUriAction)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "i0SAJP-Zhd",
        rootSubjectKey: "wihOjn-0Z",
        rootPropertyKey: "i0SAJP-Zhd",
        literal: null,
        lang: "en",
        uri: "http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749",
        label: "How to Cook Everything",
        valueSubjectKey: null,
        errors: [],
        propertyUri: "http://id.loc.gov/ontologies/bibframe/instanceOf",
      })
      expect(newState.properties["i0SAJP-Zhd"].valueKeys).toContain("DxGx7WMh3")
      expect(newState.properties["i0SAJP-Zhd"].show).toBe(true)
      expect(newState.subjects["wihOjn-0Z"].bfAdminMetadataRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfInstanceRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfItemRefs).toHaveLength(0)
      expect(
        newState.subjects["wihOjn-0Z"].localAdminMetadataForRefs
      ).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfWorkRefs).toEqual([
        "http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738",
        "http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749",
      ])
    })
  })

  describe("new uri value that is a bf Instance ref", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLookup: true })

      const newAddUriAction = {
        ...addUriAction,
        payload: {
          ...addUriAction.payload,
          value: {
            ...addUriAction.payload.value,
            propertyUri: "http://id.loc.gov/ontologies/bibframe/hasInstance",
          },
        },
      }

      const newState = reducer(oldState.entities, newAddUriAction)

      expect(newState.subjects["wihOjn-0Z"].bfAdminMetadataRefs).toHaveLength(0)
      expect(
        newState.subjects["wihOjn-0Z"].localAdminMetadataForRefs
      ).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfInstanceRefs).toEqual([
        "http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749",
      ])
      expect(newState.subjects["wihOjn-0Z"].bfItemRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfWorkRefs).toHaveLength(1)
    })
  })

  describe("new uri value that is a bf Item ref", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLookup: true })

      const newAddUriAction = {
        ...addUriAction,
        payload: {
          ...addUriAction.payload,
          value: {
            ...addUriAction.payload.value,
            propertyUri: "http://id.loc.gov/ontologies/bibframe/hasItem",
          },
        },
      }

      const newState = reducer(oldState.entities, newAddUriAction)

      expect(newState.subjects["wihOjn-0Z"].bfAdminMetadataRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfInstanceRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfItemRefs).toEqual([
        "http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749",
      ])
      expect(
        newState.subjects["wihOjn-0Z"].localAdminMetadataForRefs
      ).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfWorkRefs).toHaveLength(1)
    })
  })

  describe("new uri value that is a bf Admin Metadata ref", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLookup: true })

      const newAddUriAction = {
        ...addUriAction,
        payload: {
          ...addUriAction.payload,
          value: {
            ...addUriAction.payload.value,
            propertyUri: "http://id.loc.gov/ontologies/bibframe/adminMetadata",
          },
        },
      }

      const newState = reducer(oldState.entities, newAddUriAction)

      expect(newState.subjects["wihOjn-0Z"].bfAdminMetadataRefs).toEqual([
        "http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749",
      ])
      expect(newState.subjects["wihOjn-0Z"].bfInstanceRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfItemRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfWorkRefs).toHaveLength(1)
      expect(
        newState.subjects["wihOjn-0Z"].localAdminMetadataForRefs
      ).toHaveLength(0)
    })
  })

  describe("new uri value that is a sinopia Local Admin Metadata ref", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLookup: true })

      const newAddUriAction = {
        ...addUriAction,
        payload: {
          ...addUriAction.payload,
          value: {
            ...addUriAction.payload.value,
            propertyUri: "http://sinopia.io/vocabulary/localAdminMetadataFor",
          },
        },
      }

      const newState = reducer(oldState.entities, newAddUriAction)

      expect(newState.subjects["wihOjn-0Z"].localAdminMetadataForRefs).toEqual([
        "http://localhost:3000/resource/85770f92-f8cf-48ee-970a-aefc97843749",
      ])
      expect(newState.subjects["wihOjn-0Z"].bfInstanceRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfItemRefs).toHaveLength(0)
      expect(newState.subjects["wihOjn-0Z"].bfWorkRefs).toHaveLength(1)
      expect(newState.subjects["wihOjn-0Z"].bfAdminMetadataRefs).toHaveLength(0)
    })
  })
})

describe("clearResource()", () => {
  it("removes resource", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.entities.versions = {
      t9zVwg2zO: [
        {
          timestamp: "2019-10-16T17:13:45.084Z",
          user: "michelle",
          group: "stanford",
          templateId: "ld4p:RT:bf2:Title:CollTitle",
        },
      ],
    }
    oldState.entities.relationships.t9zVwg2zO = {
      bfAdminMetadataRefs: [],
      bfItemRefs: [],
      bfInstanceRefs: [],
      bfWorkRefs: [],
    }

    const action = {
      type: "CLEAR_RESOURCE",
      payload: "t9zVwg2zO",
    }

    const newState = reducer(oldState.entities, action)
    expect(Object.keys(newState.subjects)).toHaveLength(0)
    expect(Object.keys(newState.properties)).toHaveLength(0)
    expect(Object.keys(newState.values)).toHaveLength(0)
    expect(Object.keys(newState.versions)).toHaveLength(0)
    expect(Object.keys(newState.relationships)).toHaveLength(0)
  })
})

describe("clearResourceFromEditor()", () => {
  it("removes resource", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.errors["resourceedit-t9zVwg2zO"] = ["An error"]

    const action = {
      type: "CLEAR_RESOURCE",
      payload: "t9zVwg2zO",
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.errors["resourceedit-t9zVwg2zO"]).toBe(undefined)
    expect(newState.currentResource).toBe(null)
    expect(newState.resources).toStrictEqual([])
  })
})

describe("hideProperty()", () => {
  it("sets show to false for property", () => {
    const oldState = {
      properties: {
        "kqKVn-1TbC": {
          key: "kqKVn-1TbC",
          show: true,
        },
      },
    }

    const action = {
      type: "HIDE_PROPERTY",
      payload: "kqKVn-1TbC",
    }

    const newState = reducer(oldState, action)
    expect(newState.properties["kqKVn-1TbC"].show).toBeFalsy()
  })
})

describe("hideNavProperty()", () => {
  it("sets showNav to false for property", () => {
    const oldState = {
      properties: {
        "kqKVn-1TbC": {
          key: "kqKVn-1TbC",
          showNav: true,
        },
      },
    }

    const action = {
      type: "HIDE_NAV_PROPERTY",
      payload: "kqKVn-1TbC",
    }

    const newState = reducer(oldState, action)
    expect(newState.properties["kqKVn-1TbC"].showNav).toBeFalsy()
  })
})

describe("hideNavSubject()", () => {
  it("sets showNav to false for subject", () => {
    const oldState = {
      subjects: {
        "kqKVn-1TbC": {
          key: "kqKVn-1TbC",
          showNav: true,
        },
      },
    }

    const action = {
      type: "HIDE_NAV_SUBJECT",
      payload: "kqKVn-1TbC",
    }

    const newState = reducer(oldState, action)
    expect(newState.subjects["kqKVn-1TbC"].showNav).toBeFalsy()
  })
})

describe("removeSubject()", () => {
  it("removes a subject from state", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: "REMOVE_SUBJECT",
      payload: "t9zVwg2zO",
    }

    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.t9zVwg2zO).toBe(undefined)
    expect(newState.properties["JQEtq-vmq8"]).toBe(undefined)
    expect(newState.values.CxGx7WMh2).toBe(undefined)
  })
})

describe("removeValue()", () => {
  describe("without an error", () => {
    it("removes a value for a property", () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      const action = {
        type: "REMOVE_VALUE",
        payload: "CxGx7WMh2",
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.values.CxGx7WMh2).toBe(undefined)
      expect(newState.properties["JQEtq-vmq8"].valueKeys).not.toContain(
        "CxGx7WMh2"
      )
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).not.toContain("CxGx7WMh2")
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
      expect(
        newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys
      ).not.toContain("CxGx7WMh2")
    })
  })
  describe("with a uri that is a sinopia Local Admin Metadata ref", () => {
    it("removes a value for a property", () => {
      const oldState = createState({ hasResourceWithLookup: true })
      oldState.entities.values["s8-qt3-uu"].propertyUri =
        "http://sinopia.io/vocabulary/localAdminMetadataFor"
      oldState.entities.subjects["wihOjn-0Z"].localAdminMetadataForRefs = [
        "http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738",
      ]

      const action = {
        type: "REMOVE_VALUE",
        payload: "s8-qt3-uu",
      }

      const newState = reducer(oldState.entities, action)
      expect(newState.values["s8-qt3-uu"]).toBe(undefined)
      expect(newState.subjects["wihOjn-0Z"].localAdminMetadataForRefs).toEqual(
        []
      )
    })
  })
  describe("with an error", () => {
    it("removes a value for a property and clears error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasError: true,
      })
      oldState.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ].required = false
      const action = {
        type: "REMOVE_VALUE",
        payload: "CxGx7WMh2",
      }

      expect(
        oldState.entities.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")
      expect(
        oldState.entities.subjects.t9zVwg2zO.descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")

      const newState = reducer(oldState.entities, action)
      expect(newState.values.CxGx7WMh2).toBe(undefined)
      expect(newState.properties["JQEtq-vmq8"].valueKeys).not.toContain(
        "CxGx7WMh2"
      )
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).not.toContain("CxGx7WMh2")
      expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
      expect(
        newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys
      ).not.toContain("CxGx7WMh2")
      expect(
        newState.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).not.toContain("JQEtq-vmq8")
      expect(
        newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys
      ).not.toContain("JQEtq-vmq8")
    })
  })
})

describe("saveResourceFinished()", () => {
  it("sets resource as changed and date of last save", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.entities.subjects.t9zVwg2zO.changed = true
    const action = {
      type: "SAVE_RESOURCE_FINISHED",
      payload: {
        resourceKey: "t9zVwg2zO",
        timestamp: 1594667068562,
      },
    }
    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.t9zVwg2zO.changed).toBe(false)

    const newState2 = editorReducer(oldState.editor, action)
    expect(newState2.lastSave.t9zVwg2zO).toBe(1594667068562)
  })
})

describe("loadResourceFinished()", () => {
  it("sets resource as not changed with no defaults", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.entities.subjects.t9zVwg2zO.changed = true
    const action = {
      type: "LOAD_RESOURCE_FINISHED",
      payload: "t9zVwg2zO",
    }
    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.t9zVwg2zO.changed).toBe(false)
  })

  it("sets resource as changed with a default value", () => {
    const oldState = createState({
      hasResourceWithLiteral: true,
      hasDefaultLiterals: true,
    })
    oldState.entities.subjects.t9zVwg2zO.changed = true
    const action = {
      type: "LOAD_RESOURCE_FINISHED",
      payload: "t9zVwg2zO",
    }
    const newState = reducer(oldState.entities, action)
    expect(newState.subjects.t9zVwg2zO.changed).toBe(true)
  })
})

describe("setBaseURL()", () => {
  it("sets base url", () => {
    const oldState = {
      subjects: {
        abcde345: {
          key: "abcde345",
          uri: "",
          rootSubjectKey: "fghi678",
        },
        fghi678: {
          key: "fghi678",
          changed: false,
        },
      },
    }
    const action = {
      type: "SET_BASE_URL",
      payload: {
        resourceKey: "abcde345",
        resourceURI: "https://sinopia.io/stanford/456hkl",
      },
    }
    const newState = reducer(oldState, action)
    expect(newState.subjects.abcde345.uri).toEqual(
      "https://sinopia.io/stanford/456hkl"
    )
    expect(newState.subjects.fghi678.changed).toEqual(false)
  })
})

describe("setCurrentEditResource()", () => {
  it("sets current resource if resource is in editor resources", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.currentResource = "abc123"

    const action = {
      type: "SET_CURRENT_EDIT_RESOURCE",
      payload: "t9zVwg2zO",
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentResource).toBe("t9zVwg2zO")
    expect(newState.resources).toStrictEqual(["t9zVwg2zO"])
  })

  it("sets current resource and adds to editor resources", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.resources = []

    const action = {
      type: "SET_CURRENT_EDIT_RESOURCE",
      payload: "t9zVwg2zO",
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentResource).toBe("t9zVwg2zO")
    expect(newState.resources).toStrictEqual(["t9zVwg2zO"])
  })

  it("sets current resource to null", () => {
    const oldState = createState({ hasResourceWithLiteral: true })

    const action = {
      type: "SET_CURRENT_EDIT_RESOURCE",
      payload: null,
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentResource).toBeNull()
    expect(newState.resources).toStrictEqual(["t9zVwg2zO"])
  })
})

describe("setCurrentPreviewResource()", () => {
  it("sets current preview resource if resource is in editor resources", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.currentPreviewResource = "abc123"

    const action = {
      type: "SET_CURRENT_PREVIEW_RESOURCE",
      payload: "t9zVwg2zO",
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentPreviewResource).toBe("t9zVwg2zO")
    expect(newState.resources).toStrictEqual(["t9zVwg2zO"])
  })

  it("sets current preview resource and adds to editor resources", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.editor.resources = []

    const action = {
      type: "SET_CURRENT_PREVIEW_RESOURCE",
      payload: "t9zVwg2zO",
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentPreviewResource).toBe("t9zVwg2zO")
    expect(newState.resources).toStrictEqual(["t9zVwg2zO"])
  })

  it("sets current preview resource to null", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    oldState.currentPreviewResource = "abc123"

    const action = {
      type: "SET_CURRENT_PREVIEW_RESOURCE",
      payload: null,
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.currentPreviewResource).toBeNull()
    expect(newState.resources).toStrictEqual(["t9zVwg2zO"])
  })
})

describe("setUnusedRDF()", () => {
  it("sets unused RDF", () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: "SET_UNUSED_RDF",
      payload: {
        resourceKey: "t9zVwg2zO",
        rdf: "<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> 'abcde' .",
      },
    }

    const newState = editorReducer(oldState.editor, action)
    expect(newState.unusedRDF.t9zVwg2zO).toBe(
      "<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> 'abcde' ."
    )
  })
})

describe("showProperty()", () => {
  it("sets show to true for property", () => {
    const oldState = {
      properties: {
        "kqKVn-1TbC": {
          key: "kqKVn-1TbC",
          show: false,
        },
      },
    }
    const action = {
      type: "SHOW_PROPERTY",
      payload: "kqKVn-1TbC",
    }
    const newState = reducer(oldState, action)
    expect(newState.properties["kqKVn-1TbC"].show).toBeTruthy()
  })
})

describe("showNavProperty()", () => {
  it("sets showNav to true for property", () => {
    const oldState = {
      subjects: {
        "jqKVn-2TbC": {
          key: "jqKVn-2TbC",
          changed: false,
        },
      },
      properties: {
        "kqKVn-1TbC": {
          key: "kqKVn-1TbC",
          showNav: false,
          rootSubjectKey: "jqKVn-2TbC",
        },
      },
    }
    const action = {
      type: "SHOW_NAV_PROPERTY",
      payload: "kqKVn-1TbC",
    }
    const newState = reducer(oldState, action)
    expect(newState.properties["kqKVn-1TbC"].showNav).toBe(true)
    expect(newState.subjects["jqKVn-2TbC"].changed).toBe(false)
  })
})

describe("showNavSubject()", () => {
  it("sets showNav to true for subject", () => {
    const oldState = {
      subjects: {
        "jqKVn-2TbC": {
          key: "jqKVn-2TbC",
          changed: false,
        },
        "kqKVn-1TbC": {
          key: "kqKVn-1TbC",
          showNav: false,
          rootSubjectKey: "jqKVn-2TbC",
        },
      },
    }
    const action = {
      type: "SHOW_NAV_SUBJECT",
      payload: "kqKVn-1TbC",
    }
    const newState = reducer(oldState, action)
    expect(newState.subjects["kqKVn-1TbC"].showNav).toBe(true)
    expect(newState.subjects["jqKVn-2TbC"].changed).toBe(false)
  })
})

describe("setResourceGroup()", () => {
  it("sets group", () => {
    const oldState = {
      subjects: {
        abcde345: {
          key: "abcde345",
          changed: false,
          rootSubjectKey: "abcde345",
        },
      },
    }
    const action = {
      type: "SET_RESOURCE_GROUP",
      payload: {
        resourceKey: "abcde345",
        group: "stanford",
        editGroups: ["cornell"],
      },
    }
    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      subjects: {
        abcde345: {
          group: "stanford",
          editGroups: ["cornell"],
          changed: true,
          key: "abcde345",
          rootSubjectKey: "abcde345",
        },
      },
    })
  })
})

describe("setValueOrder()", () => {
  it("sets value order", () => {
    const oldState = createState({ hasResourceWithTwoNestedResources: true })

    expect(oldState.entities.properties.v1o90QO1Qx.valueKeys).toEqual([
      "VDOeQCnFA8",
      "VDOeQCnFA9",
    ])
    const subjectKey = oldState.entities.properties.v1o90QO1Qx.subjectKey
    expect(oldState.entities.subjects[subjectKey].changed).toBeFalsy
    const action = {
      type: "SET_VALUE_ORDER",
      payload: {
        valueKey: "VDOeQCnFA9",
        index: 1,
      },
    }

    const newState = reducer(oldState.entities, action)
    expect(newState.subjects[subjectKey].changed).toBeTruthy

    expect(newState.properties.v1o90QO1Qx.valueKeys).toEqual([
      "VDOeQCnFA9",
      "VDOeQCnFA8",
    ])
  })
})

describe("updateValue()", () => {
  describe("update literal value", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "CxGx7WMh2",
          literal: "bar",
          lang: "taw",
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.CxGx7WMh2).toStrictEqual({
        key: "CxGx7WMh2",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "bar",
        lang: "taw",
        uri: null,
        label: null,
        valueSubjectKey: null,
        errors: [],
        component: "InputLiteralValue",
        propertyUri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("CxGx7WMh2")
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).toContain("CxGx7WMh2")
      expect(newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys).toContain(
        "CxGx7WMh2"
      )
    })
  })

  describe("update literal value with validation error", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })
      oldState.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ].required = true

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "CxGx7WMh2",
          literal: "",
          lang: null,
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.CxGx7WMh2).toStrictEqual({
        key: "CxGx7WMh2",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        errors: ["Literal required"],
        component: "InputLiteralValue",
        propertyUri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("CxGx7WMh2")
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).not.toContain("CxGx7WMh2")
      expect(
        newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys
      ).not.toContain("CxGx7WMh2")
      expect(
        newState.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")
      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain(
        "JQEtq-vmq8"
      )
    })
  })

  describe("update rdfs label value for resource subject", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLiteral: true })

      // change propertyTemplate to be one for rdfs label
      oldState.entities.propertyTemplates = {
        "resourceTemplate:testing:uber1 > http://www.w3.org/2000/01/rdf-schema#label":
          build.propertyTemplate({
            key: "resourceTemplate:testing:uber1 > http://www.w3.org/2000/01/rdf-schema#label",
            subjectTemplateKey: "resourceTemplate:testing:uber1",
            label: "rdfs label",
            uris: { "http://www.w3.org/2000/01/rdf-schema#label": "label" },
            type: "literal",
            component: "InputLiteral",
          }),
      }
      oldState.entities.properties["JQEtq-vmq8"].propertyTemplateKey =
        "resourceTemplate:testing:uber1 > http://www.w3.org/2000/01/rdf-schema#label"
      oldState.entities.values.CxGx7WMh2.propertyUri =
        "http://www.w3.org/2000/01/rdf-schema#label"

      const newLabelValue = "resource root subject NEW label value!"
      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "CxGx7WMh2",
          literal: newLabelValue,
          lang: null,
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.CxGx7WMh2).toStrictEqual({
        key: "CxGx7WMh2",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: newLabelValue,
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        errors: [],
        component: "InputLiteralValue",
        propertyUri: "http://www.w3.org/2000/01/rdf-schema#label",
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("CxGx7WMh2")
      expect(newState.subjects.t9zVwg2zO.label).toEqual(newLabelValue)
    })
  })

  describe("update uri value", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithUri: true })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "a_-Jp0pY6pH6ytCtfr-mx",
          uri: "http://id.loc.gov/authorities/names/nr2003037533",
          label: "Laurent Martres",
          lang: "en",
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values["a_-Jp0pY6pH6ytCtfr-mx"]).toStrictEqual({
        key: "a_-Jp0pY6pH6ytCtfr-mx",
        literal: null,
        lang: "en",
        uri: "http://id.loc.gov/authorities/names/nr2003037533",
        label: "Laurent Martres",
        propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
        rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        valueSubjectKey: null,
        errors: [],
        component: "InputURIValue",
        propertyUri:
          "http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      })
      expect(newState.properties.RPaGmJ_8IQi8roZ1oj1uK.valueKeys).toContain(
        "a_-Jp0pY6pH6ytCtfr-mx"
      )
      expect(
        newState.properties.RPaGmJ_8IQi8roZ1oj1uK.descUriOrLiteralValueKeys
      ).toContain("a_-Jp0pY6pH6ytCtfr-mx")
      expect(
        newState.subjects.FYPd18JgfhSGaeviY7NNu.descUriOrLiteralValueKeys
      ).toContain("a_-Jp0pY6pH6ytCtfr-mx")
    })
  })

  describe("update uri value missing uri", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithUri: true })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "a_-Jp0pY6pH6ytCtfr-mx",
          uri: null,
          label: "Laurent Martres",
          lang: "en",
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values["a_-Jp0pY6pH6ytCtfr-mx"]).toStrictEqual({
        key: "a_-Jp0pY6pH6ytCtfr-mx",
        literal: null,
        lang: "en",
        uri: null,
        label: "Laurent Martres",
        propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
        rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        valueSubjectKey: null,
        errors: ["URI required"],
        component: "InputURIValue",
        propertyUri:
          "http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      })

      expect(
        newState.properties.RPaGmJ_8IQi8roZ1oj1uK.descWithErrorPropertyKeys
      ).toContain("RPaGmJ_8IQi8roZ1oj1uK")
      expect(
        newState.subjects.FYPd18JgfhSGaeviY7NNu.descWithErrorPropertyKeys
      ).toContain("RPaGmJ_8IQi8roZ1oj1uK")
    })
  })

  describe("update uri value missing label", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithUri: true })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "a_-Jp0pY6pH6ytCtfr-mx",
          uri: "http://id.loc.gov/authorities/names/nr2003037533",
          label: null,
          lang: null,
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values["a_-Jp0pY6pH6ytCtfr-mx"]).toStrictEqual({
        key: "a_-Jp0pY6pH6ytCtfr-mx",
        literal: null,
        lang: null,
        uri: "http://id.loc.gov/authorities/names/nr2003037533",
        label: null,
        propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
        rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
        valueSubjectKey: null,
        errors: ["Label required"],
        component: "InputURIValue",
        propertyUri:
          "http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      })

      expect(
        newState.properties.RPaGmJ_8IQi8roZ1oj1uK.descWithErrorPropertyKeys
      ).toContain("RPaGmJ_8IQi8roZ1oj1uK")
      expect(
        newState.subjects.FYPd18JgfhSGaeviY7NNu.descWithErrorPropertyKeys
      ).toContain("RPaGmJ_8IQi8roZ1oj1uK")
    })
  })

  describe("update lookup value to uri", () => {
    it("updates state", () => {
      const oldState = createState({ hasResourceWithLookup: true })
      oldState.entities.values["s8-qt3-uu"] = {
        key: "s8-qt3-uu",
        rootSubjectKey: "wihOjn-0Z",
        rootPropertyKey: "i0SAJP-Zhd",
        literal: null,
        lang: null,
        uri: null,
        label: null,
        propertyKey: "i0SAJP-Zhd",
        valueSubjectKey: null,
        errors: [],
        component: "InputLookupValue",
      }

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "s8-qt3-uu",
          uri: "http://id.loc.gov/authorities/names/nr2003037533",
          label: "Laurent Martres",
          lang: "en",
          component: "InputURIComponent",
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values["s8-qt3-uu"]).toStrictEqual({
        key: "s8-qt3-uu",
        rootSubjectKey: "wihOjn-0Z",
        rootPropertyKey: "i0SAJP-Zhd",
        literal: null,
        lang: "en",
        uri: "http://id.loc.gov/authorities/names/nr2003037533",
        label: "Laurent Martres",
        propertyKey: "i0SAJP-Zhd",
        valueSubjectKey: null,
        errors: [],
        component: "InputURIComponent",
      })
    })
  })
})

describe("setCurrentDiffResources()", () => {
  it("replaces", () => {
    const oldState = createState({ hasCurrentDiff: true })

    const action = {
      type: "SET_CURRENT_DIFF_RESOURCES",
      payload: {
        compareFromResourceKey: "i0SAJP-Zhd",
        compareToResourceKey: "wihOjn-0Z",
      },
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentDiff).toStrictEqual({
      compareFrom: "i0SAJP-Zhd",
      compareTo: "wihOjn-0Z",
    })
  })

  it("clears when null", () => {
    const oldState = createState({ hasCurrentDiff: true })

    const action = {
      type: "SET_CURRENT_DIFF_RESOURCES",
      payload: {
        compareFromResourceKey: null,
        compareToResourceKey: null,
      },
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentDiff).toStrictEqual({
      compareFrom: null,
      compareTo: null,
    })
  })

  it("retains when undefined", () => {
    const oldState = createState({ hasCurrentDiff: true })

    const action = {
      type: "SET_CURRENT_DIFF_RESOURCES",
      payload: {
        compareFromResourceKey: undefined,
        compareToResourceKey: undefined,
      },
    }

    const newState = reducer(oldState.editor, action)
    expect(newState.currentDiff).toStrictEqual({
      compareFrom: "7caLbfwwlf",
      compareTo: "ljAblGiBW",
    })
  })
})

const versions = [
  {
    timestamp: "2019-10-16T17:13:45.084Z",
    user: "michelle",
    group: "stanford",
    templateId: "ld4p:RT:bf2:Title:CollTitle",
  },
]

describe("setVersions()", () => {
  it("updates state", () => {
    const oldState = createState()

    const action = {
      type: "SET_VERSIONS",
      payload: {
        resourceKey: "i0SAJP-Zhd",
        versions,
      },
    }

    const newState = reducer(oldState.entities, action)
    expect(newState.versions["i0SAJP-Zhd"]).toEqual(versions)
  })
})

describe("clearVersions()", () => {
  it("updates state", () => {
    const oldState = createState()
    oldState.entities.versions = { "i0SAJP-Zhd": versions }

    const action = {
      type: "CLEAR_VERSIONS",
      payload: "i0SAJP-Zhd",
    }

    const newState = reducer(oldState.entities, action)
    expect(Object.entries(newState.versions)).toHaveLength(0)
  })
})

describe("setValuePropertyURI()", () => {
  it("updates state", () => {
    const oldState = createState({ hasResourceWithLiteral: true })

    const action = {
      type: "SET_VALUE_PROPERTY_URI",
      payload: {
        valueKey: "CxGx7WMh2",
        uri: "http://id.loc.gov/ontologies/bibframe/alternateTitle",
      },
    }

    const newState = reducer(oldState.entities, action)

    expect(newState.values.CxGx7WMh2.propertyUri).toEqual(
      "http://id.loc.gov/ontologies/bibframe/alternateTitle"
    )
  })
})

describe("setPropertyPropertyURI()", () => {
  it("updates state", () => {
    const oldState = createState({ hasResourceWithLiteral: true })

    const action = {
      type: "SET_PROPERTY_PROPERTY_URI",
      payload: {
        propertyKey: "JQEtq-vmq8",
        uri: "http://id.loc.gov/ontologies/bibframe/alternateTitle",
      },
    }

    const newState = reducer(oldState.entities, action)

    expect(newState.properties["JQEtq-vmq8"].propertyUri).toEqual(
      "http://id.loc.gov/ontologies/bibframe/alternateTitle"
    )
  })
})
