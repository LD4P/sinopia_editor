// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'
import { initialState } from "store"
import StateResourceBuilder from "./stateResourceBuilderUtils"
import _ from "lodash"

const build = new StateResourceBuilder()

export const createState = (options = {}) => {
  const state = _.cloneDeep(initialState)
  buildAuthenticate(state, options)
  buildLanguages(state, options)
  buildGroups(state, options)
  buildResourceWithLiteral(state, options)
  buildTwoLiteralResources(state, options)
  buildResourceWithUri(state, options)
  buildResourceWithLookup(state, options)
  buildResourceWithList(state, options)
  buildResourceWithContractedLiteral(state, options)
  buildResourceWithNestedResource(state, options)
  buildResourceWithTwoNestedResources(state, options)
  buildResourceWithContractedNestedResource(state, options)
  buildResourceWithError(state, options)
  buildTemplateWithLiteral(state, options)
  buildExports(state, options)
  buildLookups(state, options)
  buildSearchResults(state, options)
  buildCurrentDiff(state, options)

  return state
}
const buildGroups = (state, options) => {
  if (options.noGroupMap) return

  state.entities.groupMap = {
    stanford: "Stanford University",
    pcc: "Program for Cooperative Cataloging",
    cornell: "Cornell University",
    loc: "Library of Congress",
    yale: "Yale University",
    princeton: "Princeton University",
    duke: "Duke University",
  }
}

const buildExports = (state, options) => {
  if (options.noExports) return

  state.entities.exports = [
    "sinopia_export_all_2020-01-01T00:00:00.000Z.zip",
    "stanford_2020-01-01T00:00:00.000Z.zip",
  ]
}

const buildAuthenticate = (state, options) => {
  state.authenticate = { authenticationState: {} }

  if (options.notAuthenticated) return

  let groups = ["stanford", "pcc"]
  if (options.noGroups) groups = []
  if (options.otherGroups) groups = ["loc"]
  if (options.editGroups) groups = ["cornell"]

  state.authenticate = {
    user: {
      username: "Foo McBar",
      groups,
    },
  }
}

const buildLanguages = (state, options) => {
  if (options.noLanguage) return

  state.entities.languageLookup = [
    { id: "tai", label: "Tai languages" },
    { id: "eng", label: "English" },
  ]
  state.entities.languages = {
    tai: "Tai languages",
    eng: "English",
  }
}

const buildResourceWithError = (state, options) => {
  if (!options.hasResourceWithError) return

  state.editor = {
    resourceValidation: {
      "3h4Fp8ANu": true,
    },
    errors: {
      "3h4Fp8ANu": ["error 1", "error 2"],
      lkqatmo20: {
        dairdj42u: ["error 3"],
        fQMouMqB0: ["error 4"],
      },
    },
  }
}

const buildTemplateWithLiteral = (state, options) => {
  if (!options.hasTemplateWithLiteral) return

  state.editor.currentResource = "8VrbxGPeF"
  state.entities.subjectTemplates = {
    "sinopia:template:resource": build.subjectTemplate({
      uri: "http://localhost:3000/resource/sinopia:template:resource",
      id: "sinopia:template:resource",
      clazz: "http://sinopia.io/vocabulary/ResourceTemplate",
      label: "Resource Template",
      propertyTemplateKeys: [
        "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label":
      build.propertyTemplate({
        subjectTemplateKey: "sinopia:template:resource",
        label: "Note",
        uris: { "http://www.w3.org/2000/01/rdf-schema#label": "Label" },
        type: "literal",
        component: "InputLiteral",
      }),
  }
  state.entities.subjects = {
    "8VrbxGPeF": build.resource({
      key: "8VrbxGPeF",
      uri: "http://localhost:3000/resource/sinopia:template:resource",
      subjectTemplateKey: "sinopia:template:resource",
      propertyKeys: ["mLi9ZqIjjx"],
      labels: ["Resource Template"],
      classes: ["http://sinopia.io/vocabulary/ResourceTemplate"],
    }),
  }
  state.entities.properties = {
    mLi9ZqIjjx: build.property({
      key: "mLi9ZqIjjx",
      resourceKey: "8VrbxGPeF",
      subjectKey: "8VrbxGPeF",
      propertyTemplateKey:
        "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label",
      valueKeys: ["SgS9CqKjmb"],
      labels: ["Resource Template", "Note"],
    }),
  }
  state.entities.values = {
    SgS9CqKjmb: build.literalValue({
      key: "SgS9CqKjmb",
      resourceKey: "8VrbxGPeF",
      literal: "Resource Template",
      lang: "",
      rootSubjectKey: "8VrbxGPeF",
      propertyKey: "mLi9ZqIjjx",
      propertyUri: "http://www.w3.org/2000/01/rdf-schema#label",
    }),
  }
}

const buildResourceWithLiteral = (state, options) => {
  if (!options.hasResourceWithLiteral) return

  if (options.readOnlyResource) state.editor.currentResourceIsReadOnly = true

  state.editor.currentResource = "t9zVwg2zO"
  state.editor.resources = ["t9zVwg2zO"]
  state.entities.subjectTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle": build.subjectTemplate({
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      clazz: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      author: "LD4P",
      date: "2019-08-19",
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      ],
    }),
  }

  let validationDataType = null
  if (options.hasIntegerValidation)
    validationDataType = "http://www.w3.org/2001/XMLSchema#integer"
  if (options.hasDateTimeValidation)
    validationDataType = "http://www.w3.org/2001/XMLSchema#dateTime"
  if (options.hasDateTimeStampValidation)
    validationDataType = "http://www.w3.org/2001/XMLSchema#dateTimeStamp"

  state.entities.propertyTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle":
      build.propertyTemplate({
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        label: "Abbreviated Title",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/mainTitle": "Main title",
        },
        required: !!options.hasError,
        defaults: options.hasDefaultLiterals
          ? [{ literal: "Default literal1", lang: null }]
          : [],
        type: "literal",
        validationRegex: options.hasRegexVinskyValidation ? "^Vinsky$" : null,
        validationDataType,
        component: "InputLiteral",
      }),
  }

  state.entities.subjects = {
    t9zVwg2zO: build.resource({
      key: "t9zVwg2zO",
      uri: "https://api.sinopia.io/resource/0894a8b3",
      subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
      propertyKeys: ["JQEtq-vmq8"],
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      descWithErrorPropertyKeys: options.hasError ? ["JQEtq-vmq8"] : [],
      labels: ["Abbreviated Title"],
      classes: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
    }),
  }
  state.entities.properties = {
    "JQEtq-vmq8": build.property({
      key: "JQEtq-vmq8",
      subjectKey: "t9zVwg2zO",
      propertyTemplateKey:
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      valueKeys: ["CxGx7WMh2"],
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      descWithErrorPropertyKeys: options.hasError ? ["JQEtq-vmq8"] : [],
      labels: ["Abbreviated Title", "Abbreviated Title"],
    }),
  }
  state.entities.values = {
    CxGx7WMh2: build.literalValue({
      key: "CxGx7WMh2",
      propertyKey: "JQEtq-vmq8",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: "JQEtq-vmq8",
      literal: options.hasError ? null : "foo",
      errors: options.hasError ? ["Literal required"] : [],
      propertyUri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
    }),
  }
}

const buildTwoLiteralResources = (state, options) => {
  if (!options.hasTwoLiteralResources) return

  state.editor.currentResource = "t9zVwg2zO"
  state.editor.resources = ["t9zVwg2zO", "u0aWxh3a1"]
  state.entities.subjectTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle": build.subjectTemplate({
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      clazz: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      author: "LD4P",
      date: "2019-08-19",
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      ],
    }),
    "ld4p:RT:bf2:Note": build.subjectTemplate({
      id: "ld4p:RT:bf2:Note",
      clazz: "http://id.loc.gov/ontologies/bibframe/Note",
      label: "Note",
      author: "LD4P",
      date: "2019-08-19",
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle":
      build.propertyTemplate({
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        label: "Abbreviated Title",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/mainTitle": "Main title",
        },
        type: "literal",
        component: "InputLiteral",
      }),
    "ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note":
      build.propertyTemplate({
        subjectTemplateKey: "ld4p:RT:bf2:Note",
        label: "Note",
        uris: { "http://id.loc.gov/ontologies/bibframe/note": "Note" },
        type: "literal",
        component: "InputLiteral",
      }),
  }
  state.entities.subjects = {
    t9zVwg2zO: build.resource({
      key: "t9zVwg2zO",
      uri: "https://api.sinopia.io/resource/0894a8b3",
      subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
      propertyKeys: ["JQEtq-vmq8"],
      classes: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      labels: ["Abbreviated Title"],
      label: "Abbreviated Title",
    }),
    u0aWxh3a1: build.subject({
      key: "u0aWxh3a1",
      uri: "https://api.sinopia.io/resource/0704b9c4",
      subjectTemplateKey: "ld4p:RT:bf2:Note",
      propertyKeys: ["KRFur-wnr9"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Note"],
      descUriOrLiteralValueKeys: ["DyHy8XNi3"],
      labels: ["Note"],
      label: "Note",
    }),
  }
  state.entities.properties = {
    "JQEtq-vmq8": build.property({
      key: "JQEtq-vmq8",
      subjectKey: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      propertyTemplateKey:
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      valueKeys: ["CxGx7WMh2"],
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      labels: ["Abbreviated Title", "Abbreviated Title"],
    }),
    "KRFur-wnr9": build.property({
      key: "KRFur-wnr9",
      subjectKey: "u0aWxh3a1",
      propertyTemplateKey:
        "ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note",
      valueKeys: ["DyHy8XNi3"],
      descUriOrLiteralValueKeys: ["DyHy8XNi3"],
      labels: ["Note", "Note"],
    }),
  }
  state.entities.values = {
    CxGx7WMh2: build.literalValue({
      key: "CxGx7WMh2",
      propertyKey: "JQEtq-vmq8",
      rootSubjectKey: "t9zVwg2zO",
      literal: "foo",
      lang: "eng",
      propertyUri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
    }),
    DyHy8XNi3: build.literalValue({
      key: "DyHy8XNi3",
      propertyKey: "KRFur-wnr9",
      rootSubjectKey: "u0aWxh3a1",
      literal: "This is a note",
      lang: "eng",
      propertyUri: "http://id.loc.gov/ontologies/bibframe/note",
    }),
  }
}

const buildResourceWithUri = (state, options) => {
  if (!options.hasResourceWithUri) return

  state.editor.currentResource = "wihOjn-0Z"
  state.editor.resources = ["wihOjn-0Z"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber5": build.subjectTemplate({
      uri: "http://localhost:3000/resource/resourceTemplate:testing:uber5",
      id: "resourceTemplate:testing:uber5",
      clazz: "http://id.loc.gov/ontologies/bibframe/Uber5",
      label: "Uber template5",
      remark: "Template for testing purposes with suppressed, repeatable URI.",
      suppressible: true,
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1":
      build.propertyTemplate({
        subjectTemplateKey: "resourceTemplate:testing:uber5",
        label: "Uber template5, property1",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/uber/template5/property1":
            "Property1",
        },
        repeatable: true,
        remark: "A repeatable URI",
        type: "uri",
        component: "InputURI",
      }),
  }

  state.entities.subjects = {
    FYPd18JgfhSGaeviY7NNu: build.resource({
      key: "FYPd18JgfhSGaeviY7NNu",
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      subjectTemplateKey: "resourceTemplate:testing:uber5",
      labels: ["Uber template5"],
      propertyKeys: ["RPaGmJ_8IQi8roZ1oj1uK"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber5"],
    }),
  }
  state.entities.properties = {
    RPaGmJ_8IQi8roZ1oj1uK: build.property({
      key: "RPaGmJ_8IQi8roZ1oj1uK",
      subjectKey: "FYPd18JgfhSGaeviY7NNu",
      propertyTemplateKey:
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      labels: ["Uber template5", "Uber template5, property1"],
      valueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
    }),
  }
  state.entities.values = {
    "a_-Jp0pY6pH6ytCtfr-mx": build.uriValue({
      key: "a_-Jp0pY6pH6ytCtfr-mx",
      uri: "https://id.loc.gov/authorities/names/n81079286",
      label: "Kelsey, Michael R.",
      propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
    }),
  }
}

const buildResourceWithList = (state, options) => {
  if (!options.hasResourceWithList) return

  state.editor.currentResource = "wihOjn-0Z"
  state.editor.resources = ["wihOjn-0Z"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber5": build.subjectTemplate({
      uri: "http://localhost:3000/resource/resourceTemplate:testing:uber5",
      id: "resourceTemplate:testing:uber5",
      clazz: "http://id.loc.gov/ontologies/bibframe/Uber5",
      label: "Uber template5",
      remark: "Template for testing purposes with repeatable list.",
      suppressible: true,
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1":
      build.propertyTemplate({
        subjectTemplateKey: "resourceTemplate:testing:uber5",
        label: "Uber template5, property1",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/uber/template5/property1":
            "Property1",
        },
        repeatable: true,
        remark: "A repeatable list",
        authorities: [
          {
            uri: "https://id.loc.gov/vocabulary/mrectype",
            label: "type of recording",
            nonldLookup: false,
          },
        ],
        type: "uri",
        component: "InputList",
      }),
  }

  state.entities.subjects = {
    FYPd18JgfhSGaeviY7NNu: build.resource({
      key: "FYPd18JgfhSGaeviY7NNu",
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      subjectTemplateKey: "resourceTemplate:testing:uber5",
      labels: ["Uber template5"],
      propertyKeys: ["RPaGmJ_8IQi8roZ1oj1uK"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber5"],
    }),
  }
  state.entities.properties = {
    RPaGmJ_8IQi8roZ1oj1uK: build.property({
      key: "RPaGmJ_8IQi8roZ1oj1uK",
      subjectKey: "FYPd18JgfhSGaeviY7NNu",
      propertyTemplateKey:
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      labels: ["Uber template5", "Uber template5, property1"],
      valueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
    }),
  }
  state.entities.values = {
    "a_-Jp0pY6pH6ytCtfr-mx": build.value({
      key: "a_-Jp0pY6pH6ytCtfr-mx",
      propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      component: "InputListValue",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
    }),
  }
}

const buildResourceWithLookup = (state, options) => {
  if (!options.hasResourceWithLookup) return

  state.editor.currentResource = "wihOjn-0Z"
  state.editor.resources = ["wihOjn-0Z"]
  state.entities.subjectTemplates = {
    "test:resource:SinopiaLookup": build.subjectTemplate({
      id: "test:resource:SinopiaLookup",
      clazz: "http://id.loc.gov/ontologies/bibframe/Instance",
      label: "Testing sinopia lookup",
      remark: "This hits elasticsearch",
      propertyTemplateKeys: [
        "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf":
      build.propertyTemplate({
        subjectTemplateKey: "test:resource:SinopiaLookup",
        label: "Instance of (lookup)",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/instanceOf": "Instance of",
        },
        required: true,
        remark: "lookup",
        authorities: [
          {
            uri: "urn:ld4p:sinopia:bibframe:instance",
            label: "Sinopia BIBFRAME instance resources",
            nonldLookup: false,
          },
          {
            uri: "urn:ld4p:sinopia:bibframe:work",
            label: "Sinopia BIBFRAME work resources",
            nonldLookup: false,
          },
        ],
        type: "uri",
        component: "InputLookup",
      }),
  }

  state.entities.subjects = {
    "wihOjn-0Z": build.resource({
      key: "wihOjn-0Z",
      subjectTemplateKey: "test:resource:SinopiaLookup",
      bfWorkRefs: [
        "http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738",
      ],
      propertyKeys: ["i0SAJP-Zhd"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Instance"],
      changed: true,
      descUriOrLiteralValueKeys: ["s8-qt3-uu"],
      labels: ["Testing sinopia lookup"],
    }),
  }
  state.entities.properties = {
    "i0SAJP-Zhd": build.property({
      key: "i0SAJP-Zhd",
      rootSubjectKey: "wihOjn-0Z",
      rootPropertyKey: "i0SAJP-Zhd",
      subjectKey: "wihOjn-0Z",
      propertyTemplateKey:
        "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
      valueKeys: ["s8-qt3-uu"],
      descUriOrLiteralValueKeys: ["s8-qt3-uu"],
      labels: ["Testing sinopia lookup", "Instance of (lookup)"],
    }),
  }
  state.entities.values = {
    "s8-qt3-uu": build.uriValue({
      key: "s8-qt3-uu",
      rootSubjectKey: "wihOjn-0Z",
      rootPropertyKey: "i0SAJP-Zhd",
      uri: "http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738",
      label: "How to Cook Everything Vegetarian",
      propertyKey: "i0SAJP-Zhd",
      propertyUri: "http://id.loc.gov/ontologies/bibframe/instanceOf",
    }),
  }
}

const buildResourceWithContractedLiteral = (state, options) => {
  if (!options.hasResourceWithContractedLiteral) return

  state.editor.currentResource = "t9zVwg2zO"
  state.editor.resources = ["t9zVwg2zO"]
  state.entities.subjectTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle": build.subjectTemplate({
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      clazz: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      author: "LD4P",
      date: "2019-08-19",
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle":
      build.propertyTemplate({
        key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        label: "Abbreviated Title",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/mainTitle": "Main title",
        },
        type: "literal",
        component: "InputLiteral",
      }),
  }
  state.entities.subjects = {
    t9zVwg2zO: build.resource({
      key: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      uri: "https://api.sinopia.io/resource/0894a8b3",
      subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
      propertyKeys: ["JQEtq-vmq8"],
      classes: ["http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle"],
      labels: ["Abbreviated Title"],
    }),
  }
  state.entities.properties = {
    "JQEtq-vmq8": build.property({
      key: "JQEtq-vmq8",
      subjectKey: "t9zVwg2zO",
      rootPropertyKey: "JQEtq-vmq8",
      propertyTemplateKey:
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      show: true,
      labels: ["Abbreviated Title", "Abbreviated Title"],
    }),
  }
  state.entities.values = {}
}

const buildResourceWithNestedResource = (state, options) => {
  if (!options.hasResourceWithNestedResource) return

  state.editor.currentResource = "ljAblGiBW"
  state.editor.resources = ["ljAblGiBW"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber1": build.subjectTemplate({
      id: "resourceTemplate:testing:uber1",
      clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
      label: "Uber template1",
      remark: "Template for testing purposes.",
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      ],
    }),
    "resourceTemplate:testing:uber2": build.subjectTemplate({
      id: "resourceTemplate:testing:uber2",
      clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
      label: "Uber template2",
      remark:
        "Template for testing purposes with single repeatable literal with a link to Stanford at https://www.stanford.edu",
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
      build.propertyTemplate({
        key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber1",
        label: "Uber template1, property1",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
            "Property1",
        },
        repeatable: true,
        remark: "Nested, repeatable resource template.",
        type: "resource",
        component: "InputURI",
        valueSubjectTemplateKeys: ["resourceTemplate:testing:uber2"],
      }),
    "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
      build.propertyTemplate({
        key: "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber2",
        label: "Uber template2, property1",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
            "Property1",
        },
        repeatable: true,
        remark: "A repeatable literal",
        type: "literal",
        component: "InputLiteral",
      }),
  }
  state.entities.subjects = {
    ljAblGiBW: build.resource({
      key: "ljAblGiBW",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      propertyKeys: ["v1o90QO1Qx"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber1"],
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: ["Uber template1"],
    }),
    XPb8jaPWo: build.subject({
      key: "XPb8jaPWo",
      subjectTemplateKey: "resourceTemplate:testing:uber2",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      valueSubjectOfKey: "VDOeQCnFA8",
      propertyKeys: ["7caLbfwwle"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber2"],
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: ["Uber template1", "Uber template1, property1", "Uber template2"],
    }),
  }
  state.entities.properties = {
    v1o90QO1Qx: build.property({
      key: "v1o90QO1Qx",
      subjectKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      valueKeys: ["VDOeQCnFA8"],
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: ["Uber template1", "Uber template1, property1"],
    }),
    "7caLbfwwle": build.property({
      key: "7caLbfwwle",
      subjectKey: "XPb8jaPWo",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      propertyTemplateKey:
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      valueKeys: ["pRJ0lO_mT-"],
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: [
        "Uber template1",
        "Uber template1, property1",
        "Uber template2",
        "Uber template2, property1",
      ],
    }),
  }
  state.entities.values = {
    VDOeQCnFA8: build.subjectValue({
      key: "VDOeQCnFA8",
      propertyKey: "v1o90QO1Qx",
      rootSubjectKey: "ljAblGiBW",
      valueSubjectKey: "XPb8jaPWo",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
    }),
    "pRJ0lO_mT-": build.literalValue({
      key: "pRJ0lO_mT-",
      propertyKey: "7caLbfwwle",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      literal: options.hasError ? null : "foo",
      lang: "eng",
      errors: options.hasError ? ["Literal required"] : [],
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
    }),
  }
}

const buildResourceWithContractedNestedResource = (state, options) => {
  if (!options.hasResourceWithContractedNestedResource) return

  state.editor.currentResource = "ljAblGiBW"
  state.editor.resources = ["ljAblGiBW"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber1": build.subjectTemplate({
      id: "resourceTemplate:testing:uber1",
      clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
      label: "Uber template1",
      remark: "Template for testing purposes.",
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
      build.propertyTemplate({
        subjectTemplateKey: "resourceTemplate:testing:uber1",
        label: "Uber template1, property1",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
            "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
        },
        required: !!options.hasError,
        repeatable: true,
        remark: "Nested, repeatable resource template.",
        type: "resource",
        component: "InputURI",
        valueSubjectTemplateKeys: ["resourceTemplate:testing:uber2"],
      }),
  }
  state.entities.subjects = {
    ljAblGiBW: build.resource({
      key: "ljAblGiBW",
      rootSubjectKey: "ljAblGiBW",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      propertyKeys: ["v1o90QO1Qx"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber1"],
      labels: ["Uber template1"],
    }),
  }
  state.entities.properties = {
    v1o90QO1Qx: build.property({
      key: "v1o90QO1Qx",
      subjectKey: "ljAblGiBW",
      rootSubjectKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      labels: ["Uber template1", "Uber template1, property1"],
    }),
  }
  state.entities.values = {}
}

const buildLookups = (state, options) => {
  if (options.noLookups) return

  state.entities.lookups = {
    "https://id.loc.gov/vocabulary/mrectype": [
      {
        id: "EQhmzQNidXD",
        label: "analog",
        uri: "http://id.loc.gov/vocabulary/mrectype/analog",
      },
      {
        id: "xrnwYKcpPws",
        label: "digital",
        uri: "http://id.loc.gov/vocabulary/mrectype/digital",
      },
    ],
    "https://id.loc.gov/vocabulary/mrecmedium": [
      {
        id: "T06WuAcWutk",
        label: "magnetic",
        uri: "http://id.loc.gov/vocabulary/mrecmedium/mag",
      },
      {
        id: "IbbEW9qnn-1",
        label: "optical",
        uri: "http://id.loc.gov/vocabulary/mrecmedium/opt",
      },
      {
        id: "FIEXVtapJ6C",
        label: "magneto-optical",
        uri: "http://id.loc.gov/vocabulary/mrecmedium/magopt",
      },
    ],
  }
}

const buildResourceWithTwoNestedResources = (state, options) => {
  if (!options.hasResourceWithTwoNestedResources) return

  state.editor.currentResource = "ljAblGiBW"
  state.editor.resources = ["ljAblGiBW"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber1": build.subjectTemplate({
      id: "resourceTemplate:testing:uber1",
      clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
      label: "Uber template1",
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      ],
    }),
    "resourceTemplate:testing:uber2": build.subjectTemplate({
      id: "resourceTemplate:testing:uber2",
      clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
      label: "Uber template2",
      remark: "Template for testing purposes with single repeatable literal.",
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      ],
    }),
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
      build.propertyTemplate({
        subjectTemplateKey: "resourceTemplate:testing:uber1",
        label: "Uber template1, property1",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
            "Property1",
        },
        repeatable: true,
        remarkUrl: "https://www.stanford.edu",
        type: "resource",
        component: "InputURI",
        valueSubjectTemplateKeys: ["resourceTemplate:testing:uber2"],
      }),
    "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
      build.propertyTemplate({
        subjectTemplateKey: "resourceTemplate:testing:uber2",
        label: "Uber template2, property1",
        uris: {
          "http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
            "Property1",
        },
        repeatable: true,
        remark: "A repeatable literal",
        remarkUrl: "https://www.stanford.edu",
        type: "literal",
        component: "InputLiteral",
      }),
  }
  state.entities.subjects = {
    ljAblGiBW: build.resource({
      key: "ljAblGiBW",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      propertyKeys: ["v1o90QO1Qx"],
      labels: ["Uber template1"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber1"],
    }),
    XPb8jaPWo: build.subject({
      key: "XPb8jaPWo",
      subjectTemplateKey: "resourceTemplate:testing:uber2",
      resourceKey: "ljAblGiBW",
      propertyKeys: ["7caLbfwwle"],
      labels: ["Uber template2"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber2"],
    }),
    XPb8jaPWp: build.subject({
      key: "XPb8jaPWp",
      subjectTemplateKey: "resourceTemplate:testing:uber2",
      resourceKey: "ljAblGiBW",
      propertyKeys: ["7caLbfwwlf"],
      labels: ["Uber template2"],
      classes: ["http://id.loc.gov/ontologies/bibframe/Uber2"],
    }),
  }
  state.entities.properties = {
    v1o90QO1Qx: build.property({
      key: "v1o90QO1Qx",
      subjectKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      valueKeys: ["VDOeQCnFA8", "VDOeQCnFA9"],
      labels: ["Uber template1", "Uber template1, property1"],
    }),
    "7caLbfwwle": build.property({
      key: "7caLbfwwle",
      subjectKey: "XPb8jaPWo",
      resourceKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      valueKeys: ["pRJ0lO_mT-"],
      labels: ["Uber template2", "Uber template2, property1"],
    }),
    "7caLbfwwlf": build.property({
      key: "7caLbfwwlf",
      subjectKey: "XPb8jaPWp",
      resourceKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      valueKeys: ["pRJ0lO_mU-"],
      labels: ["Uber template2", "Uber template2, property1"],
    }),
  }
  state.entities.values = {
    VDOeQCnFA8: build.subjectValue({
      key: "VDOeQCnFA8",
      propertyKey: "v1o90QO1Qx",
      rootSubjectKey: "ljAblGiBW",
      valueSubjectKey: "XPb8jaPWo",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
    }),
    VDOeQCnFA9: build.subjectValue({
      key: "VDOeQCnFA9",
      propertyKey: "v1o90QO1Qx",
      rootSubjectKey: "ljAblGiBW",
      valueSubjectKey: "XPb8jaPWp",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
    }),
    "pRJ0lO_mT-": build.literalValue({
      key: "pRJ0lO_mT-",
      propertyKey: "7caLbfwwle",
      rootSubjectKey: "ljAblGiBW",
      literal: "foo",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
    }),
    "pRJ0lO_mU-": build.literalValue({
      key: "pRJ0lO_mU-",
      propertyKey: "7caLbfwwlf",
      rootSubjectKey: "ljAblGiBW",
      literal: "bar",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
    }),
  }
}

const buildSearchResults = (state, options) => {
  if (!options.hasSearchResults) return

  state.search.resource = {
    uri: "urn:ld4p:sinopia",
    results: [
      {
        uri: "http://localhost:3000/resource/4ea0b514-0475-48c6-a076-7ed30ab4d6f4",
        label: "Foo1",
        modified: "2021-10-12T21:29:51.950Z",
        type: ["http://foo/bar"],
        group: "stanford",
        editGroups: [],
      },
      {
        uri: "http://localhost:3000/resource/e1eb5c8f-8382-4abc-980c-bcdb305c1e22",
        label: "Foo2",
        modified: "2021-10-12T21:30:11.558Z",
        type: ["http://foo/bar"],
        group: "other",
        editGroups: [],
      },
    ],
    totalResults: 6,
    facetResults: {
      types: [
        {
          key: "http://foo/bar",
          doc_count: 5,
        },
        {
          key: "http://id.loc.gov/ontologies/bibframe/Work",
          doc_count: 1,
        },
      ],
      groups: [
        {
          key: "other",
          doc_count: 5,
        },
        {
          key: "stanford",
          doc_count: 1,
        },
      ],
    },
    query: "*",
    options: {
      resultsPerPage: 10,
      startOfRange: 0,
    },
  }
}

const buildCurrentDiff = (state, options) => {
  if (!options.hasCurrentDiff) return

  state.editor.currentDiff = {
    compareFrom: "7caLbfwwlf",
    compareTo: "ljAblGiBW",
  }
}

export const noop = () => {}
