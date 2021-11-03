// import { updateValueErrors } from "reducers/resources"
import Config from "Config"
// import configureMockStore from "redux-mock-store"
// import thunk from "redux-thunk"
import { createState } from "stateUtils"
import { createReducer } from "reducers/index"
import {
  // addProperty,
  // addSubject,
  addValue,
  // clearResource,
  // hideNavProperty,
  // hideNavSubject,
  // hideProperty,
  // removeSubject,
  // removeValue,
  // saveResourceFinished,
  // setBaseURL,
  // setCurrentEditResource,
  // setCurrentPreviewResource,
  // setUnusedRDF,
  // showNavProperty,
  // showNavSubject,
  // showProperty,
  // loadResourceFinished,
  // setResourceGroup,
  // setValueOrder,
  // clearResourceFromEditor,
  // saveResourceFinishedEditor,
  // updateValue,
  // setCurrentDiffResources,
  // setVersions,
  // clearVersions,
} from "reducers/resources"

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

// const mockStore = configureMockStore([thunk])

const reducers = {
  // ADD_PROPERTY: addProperty,
  // ADD_SUBJECT: addSubject,
  ADD_VALUE: addValue,
  // CLEAR_RESOURCE: clearResource,
  // CLEAR_VERSIONS: clearVersions,
  // HIDE_NAV_PROPERTY: hideNavProperty,
  // HIDE_NAV_SUBJECT: hideNavSubject,
  // HIDE_PROPERTY: hideProperty,
  // LOAD_RESOURCE_FINISHED: loadResourceFinished,
  // REMOVE_SUBJECT: removeSubject,
  // REMOVE_VALUE: removeValue,
  // SAVE_RESOURCE_FINISHED: saveResourceFinished,
  // SET_BASE_URL: setBaseURL,
  // SET_CURRENT_DIFF_RESOURCES: setCurrentDiffResources,
  // SET_RESOURCE_GROUP: setResourceGroup,
  // SET_VALUE_ORDER: setValueOrder,
  // SET_VERSIONS: setVersions,
  // SHOW_NAV_PROPERTY: showNavProperty,
  // SHOW_NAV_SUBJECT: showNavSubject,
  // SHOW_PROPERTY: showProperty,
  // UPDATE_VALUE: updateValue,
}

const reducer = createReducer(reducers)

describe("new literal value with validationDataType of integer", () => {
  describe("when value IS an integer", () => {
    it("updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasIntegerValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "8",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType: "http://www.w3.org/2001/XMLSchema/integer",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "8",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/integer",
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

  describe("when value is NOT an integer", () => {
    it("updates state including error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasIntegerValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "abc",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType: "http://www.w3.org/2001/XMLSchema/integer",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "abc",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/integer",
        errors: [
          "Literal validationDataType is 'http://www.w3.org/2001/XMLSchema/integer' but 'abc' is not an integer",
        ],
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("DxGx7WMh3")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(
        newState.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")
      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain(
        "JQEtq-vmq8"
      )
    })
  })
})

describe("new literal value with validationDataType of dateTime", () => {
  describe("when value is dateTime without seconds", () => {
    it("updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasDateTimeValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "2021-11-03T10:23:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType: "http://www.w3.org/2001/XMLSchema/dateTime",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "2021-11-03T10:23:00",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/dateTime",
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

  describe("when value is dateTime with seconds", () => {
    it("updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasDateTimeValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "2021-11-03T10:23:00.66",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType: "http://www.w3.org/2001/XMLSchema/dateTime",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "2021-11-03T10:23:00.66",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/dateTime",
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

  describe("when value is NOT a valid dateTime", () => {
    it("updates state including error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasDateTimeValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "2021-11-03T10:23:00Z-07:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType: "http://www.w3.org/2001/XMLSchema/dateTime",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "2021-11-03T10:23:00Z-07:00",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/dateTime",
        errors: [
          "Literal validationDataType is 'http://www.w3.org/2001/XMLSchema/dateTime' but '2021-11-03T10:23:00Z-07:00' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)'",
        ],
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("DxGx7WMh3")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(
        newState.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")
      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain(
        "JQEtq-vmq8"
      )
    })
  })
})

describe("new literal value with validationDataType of dateTimeStamp", () => {
  describe("when value is dateTimeStamp without seconds (GMT)", () => {
    it("updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasDateTimeStampValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "2021-11-03T10:23:00Z",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType:
              "http://www.w3.org/2001/XMLSchema/dateTimeStamp",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "2021-11-03T10:23:00Z",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/dateTimeStamp",
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

  describe("when value is dateTimeStamp with seconds and offset time zone", () => {
    it("updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasDateTimeStampValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "2021-11-03T10:23:00.66-07:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType:
              "http://www.w3.org/2001/XMLSchema/dateTimeStamp",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "2021-11-03T10:23:00.66-07:00",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/dateTimeStamp",
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

  describe("when value is NOT a valid dateTimeStamp", () => {
    it("updates state including error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasDateTimeStampValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            property: { key: "JQEtq-vmq8" },
            literal: "2021-11-03T10:23:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            validationDataType:
              "http://www.w3.org/2001/XMLSchema/dateTimeStamp",
            errors: [],
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3).toStrictEqual({
        key: "DxGx7WMh3",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "2021-11-03T10:23:00",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/dateTimeStamp",
        errors: [
          "Literal validationDataType is 'http://www.w3.org/2001/XMLSchema/dateTimeStamp' but '2021-11-03T10:23:00' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)?(Z|([+-]hh:mm))'",
        ],
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("DxGx7WMh3")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(
        newState.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")
      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain(
        "JQEtq-vmq8"
      )
    })
  })
})
