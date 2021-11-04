// import { updateValueErrors } from "reducers/resources"
import Config from "Config"
import { createState } from "stateUtils"
import { createReducer } from "reducers/index"
import { addValue, updateValue } from "reducers/resources"

// This forces Sinopia server to use fixtures
jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)

const reducers = {
  ADD_VALUE: addValue,
  UPDATE_VALUE: updateValue,
}

const reducer = createReducer(reducers)

describe("new literal value with validationDataType of integer", () => {
  describe("when value IS an integer", () => {
    it("validates and updates state", () => {
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
    it("validates and updates state including error", () => {
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
          "Expected datatype is 'http://www.w3.org/2001/XMLSchema/integer' but 'abc' is not an integer.",
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

describe("update literal value with validationDataType", () => {
  describe("when value IS NOT an integer", () => {
    it("validates and updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasIntegerValidation: true,
      })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "CxGx7WMh2",
          literal: "88.9",
          lang: null,
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.CxGx7WMh2).toStrictEqual({
        key: "CxGx7WMh2",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: "88.9",
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/integer",
        errors: [
          "Expected datatype is 'http://www.w3.org/2001/XMLSchema/integer' but '88.9' is not an integer.",
        ],
        component: "InputLiteralValue",
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("CxGx7WMh2")
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).toContain("CxGx7WMh2")
      expect(
        newState.properties["JQEtq-vmq8"].descWithErrorPropertyKeys
      ).toContain("JQEtq-vmq8")
      expect(newState.subjects.t9zVwg2zO.descWithErrorPropertyKeys).toContain(
        "JQEtq-vmq8"
      )

      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
    })
  })

  describe("update to null value", () => {
    it("updates state without validation error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasIntegerValidation: true,
      })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "CxGx7WMh2",
          literal: null,
          lang: null,
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.CxGx7WMh2).toStrictEqual({
        key: "CxGx7WMh2",
        propertyKey: "JQEtq-vmq8",
        rootSubjectKey: "t9zVwg2zO",
        rootPropertyKey: "JQEtq-vmq8",
        literal: null,
        lang: null,
        uri: null,
        label: null,
        valueSubjectKey: null,
        validationDataType: "http://www.w3.org/2001/XMLSchema/integer",
        errors: [],
        component: "InputLiteralValue",
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("CxGx7WMh2")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).toEqual([])
      expect(newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys).toEqual([])
    })
  })

  describe("update to empty string value", () => {
    it("updates state without validation error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasIntegerValidation: true,
      })

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
        validationDataType: "http://www.w3.org/2001/XMLSchema/integer",
        errors: [],
        component: "InputLiteralValue",
      })
      expect(newState.properties["JQEtq-vmq8"].valueKeys).toContain("CxGx7WMh2")
      expect(newState.properties["JQEtq-vmq8"].show).toBe(true)
      expect(
        newState.properties["JQEtq-vmq8"].descUriOrLiteralValueKeys
      ).toEqual([])
      expect(newState.subjects.t9zVwg2zO.descUriOrLiteralValueKeys).toEqual([])
    })
  })
})

describe("new literal value with validationDataType of dateTime", () => {
  describe("when value is dateTime without seconds", () => {
    it("validates and updates state", () => {
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
    it("validates and updates state", () => {
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
    it("validates and updates state including error", () => {
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
          "Expected datatype is 'http://www.w3.org/2001/XMLSchema/dateTime' but '2021-11-03T10:23:00Z-07:00' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)'.",
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
    it("validates and updates state", () => {
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
    it("validates and updates state", () => {
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
    it("validates and updates state including error", () => {
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
          "Expected datatype is 'http://www.w3.org/2001/XMLSchema/dateTimeStamp' but '2021-11-03T10:23:00' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)?(Z|([+-]hh:mm))'.",
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
