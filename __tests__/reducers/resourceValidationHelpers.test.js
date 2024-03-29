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
            propertyKey: "JQEtq-vmq8",
            literal: "8",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([])
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
            propertyKey: "JQEtq-vmq8",
            literal: "abc",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([
        "Expected datatype is 'http://www.w3.org/2001/XMLSchema#integer' but 'abc' is not an integer.",
      ])
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

      expect(newState.values.CxGx7WMh2.errors).toEqual([
        "Expected datatype is 'http://www.w3.org/2001/XMLSchema#integer' but '88.9' is not an integer.",
      ])
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

      expect(newState.values.CxGx7WMh2.errors).toEqual([])
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
      expect(newState.values.CxGx7WMh2.errors).toEqual([])
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
            propertyKey: "JQEtq-vmq8",
            literal: "2021-11-03T10:23:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([])
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
            propertyKey: "JQEtq-vmq8",
            literal: "2021-11-03T10:23:00.66",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([])
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
            propertyKey: "JQEtq-vmq8",
            literal: "2021-11-03T10:23:00Z-07:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([
        "Expected datatype is 'http://www.w3.org/2001/XMLSchema#dateTime' but '2021-11-03T10:23:00Z-07:00' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)'.",
      ])
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
            propertyKey: "JQEtq-vmq8",
            literal: "2021-11-03T10:23:00Z",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([])
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
            propertyKey: "JQEtq-vmq8",
            literal: "2021-11-03T10:23:00.66-07:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([])
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
            propertyKey: "JQEtq-vmq8",
            literal: "2021-11-03T10:23:00",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([
        "Expected datatype is 'http://www.w3.org/2001/XMLSchema#dateTimeStamp' but '2021-11-03T10:23:00' is not of the format 'YYYY-MM-DDThh:mm:ss(.s+)?(Z|([+-]hh:mm))'.",
      ])
    })
  })
})

describe("new literal value with validationDataType of EDTF", () => {
  describe("when value is valid EDTF", () => {
    it("validates and updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasEdtfValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            propertyKey: "JQEtq-vmq8",
            literal: "1945-05-2X/1964-XX-XX",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([])
    })
  })

  describe("when value is NOT a valid EDTF", () => {
    it("validates and updates state including error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasEdtfValidation: true,
      })

      const action = {
        type: "ADD_VALUE",
        payload: {
          value: {
            key: "DxGx7WMh3",
            propertyKey: "JQEtq-vmq8",
            literal: "not EDTF",
            lang: null,
            uri: null,
            label: null,
            valueSubjectKey: null,
            component: "InputLiteralValue",
          },
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.DxGx7WMh3.errors).toEqual([
        "Expected datatype is 'http://id.loc.gov/datatypes/edtf' but 'not EDTF' is not a valid EDTF format. See https://www.loc.gov/standards/datetime/.",
      ])
    })
  })
})

describe("new literal value with validationRegex", () => {
  describe("when value matches regex", () => {
    it("validates and updates state", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasRegexVinskyValidation: true,
      })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "CxGx7WMh2",
          literal: "Vinsky",
          lang: "en",
        },
      }

      const newState = reducer(oldState.entities, action)

      expect(newState.values.CxGx7WMh2.errors).toEqual([])
    })
  })

  describe("when value does NOT match regex", () => {
    it("validates and updates state including error", () => {
      const oldState = createState({
        hasResourceWithLiteral: true,
        hasRegexVinskyValidation: true,
      })

      const action = {
        type: "UPDATE_VALUE",
        payload: {
          valueKey: "CxGx7WMh2",
          literal: "Stravinsky",
          lang: "en",
        },
      }
      const newState = reducer(oldState.entities, action)

      expect(newState.values.CxGx7WMh2.errors).toEqual([
        "Expected 'Stravinsky' to match validationRegex '^Vinsky$'.",
      ])
    })
  })
})
