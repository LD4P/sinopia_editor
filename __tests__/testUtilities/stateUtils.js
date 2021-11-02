// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'
import { initialState } from "store"
import _ from "lodash"

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
    "sinopia:template:resource": {
      key: "sinopia:template:resource",
      uri: "http://localhost:3000/resource/sinopia:template:resource",
      id: "sinopia:template:resource",
      class: "http://sinopia.io/vocabulary/ResourceTemplate",
      label: "Resource Template",
      author: null,
      remark: null,
      date: null,
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label": {
      key: "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label",
      subjectTemplateKey: "sinopia:template:resource",
      label: "Note",
      uri: "http://www.w3.org/2000/01/rdf-schema#label",
      required: false,
      repeatable: false,
      ordered: false,
      immutable: false,
      remark: null,
      remarkUrl: null,
      defaults: [],
      valueSubjectTemplateKeys: [],
      authorities: [],
      type: "literal",
      component: "InputLiteral",
    },
  }
  state.entities.subjects = {
    "8VrbxGPeF": {
      key: "8VrbxGPeF",
      uri: "http://localhost:3000/resource/sinopia:template:resource",
      resourceKey: "8VrbxGPeF",
      group: null,
      editGroups: [],
      subjectTemplateKey: "sinopia:template:resource",
      bfAdminMetadataRefs: [],
      bfItemRefs: [],
      bfInstanceRefs: [],
      bfWorkRefs: [],
      propertyKeys: ["mLi9ZqIjjx"],
      changed: false,
      showNav: false,
      subjectTemplate: {
        key: "sinopia:template:resource",
        uri: "http://localhost:3000/resource/sinopia:template:resource",
        id: "sinopia:template:resource",
        class: "http://sinopia.io/vocabulary/ResourceTemplate",
        label: "Resource Template",
        author: null,
        remark: null,
        date: null,
        propertyTemplateKeys: [
          "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label",
        ],
      },
      labels: ["Resource Template"],
    },
  }
  state.entities.properties = {
    mLi9ZqIjjx: {
      key: "mLi9ZqIjjx",
      resourceKey: "8VrbxGPeF",
      show: true,
      subjectKey: "8VrbxGPeF",
      propertyTemplateKey:
        "sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label",
      valueKeys: ["SgS9CqKjmb"],
      labels: ["Resource Template", "Note"],
      showNav: false,
    },
  }
  state.entities.values = {
    SgS9CqKjmb: {
      key: "SgS9CqKjmb",
      resourceKey: "8VrbxGPeF",
      literal: "Resource Template",
      lang: "",
      uri: null,
      label: null,
      propertyKey: "mLi9ZqIjjx",
      valueSubjectKey: null,
      errors: [],
      component: "InputLiteralValue",
    },
  }
}

const buildResourceWithLiteral = (state, options) => {
  if (!options.hasResourceWithLiteral) return

  if (options.readOnlyResource) state.editor.currentResourceIsReadOnly = true

  state.editor.currentResource = "t9zVwg2zO"
  state.editor.resources = ["t9zVwg2zO"]
  state.entities.subjectTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle": {
      key: "ld4p:RT:bf2:Title:AbbrTitle",
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      class: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      author: "LD4P",
      date: "2019-08-19",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle":
      {
        key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        label: "Abbreviated Title",
        uri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
        required: !!options.hasError,
        repeatable: false,
        immutable: false,
        defaults: [],
        remarkUrl: null,
        type: "literal",
        component: "InputLiteral",
        authorities: [],
      },
  }

  if (options.hasDefaultLiterals) {
    state.entities.propertyTemplates[
      "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
    ].defaults = [
      {
        literal: "Default literal1",
        lang: null,
      },
    ]
  }

  if (options.hasValidationDataTypeInteger) {
    state.entities.propertyTemplates[
      "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
    ].validationDataType = "http://www.w3.org/2001/XMLSchema/integer"
  }

  state.entities.subjects = {
    t9zVwg2zO: {
      key: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: null,
      valueSubjectOfKey: null,
      uri: "https://api.sinopia.io/resource/0894a8b3",
      subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
      propertyKeys: ["JQEtq-vmq8"],
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
      editGroups: [],
      changed: false,
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      descWithErrorPropertyKeys: options.hasError ? ["JQEtq-vmq8"] : [],
      labels: ["Abbreviated Title"],
      label: "Abbreviated Title",
      showNav: false,
    },
  }
  state.entities.properties = {
    "JQEtq-vmq8": {
      key: "JQEtq-vmq8",
      subjectKey: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: "JQEtq-vmq8",
      propertyTemplateKey:
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      valueKeys: ["CxGx7WMh2"],
      show: true,
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      descWithErrorPropertyKeys: options.hasError ? ["JQEtq-vmq8"] : [],
      labels: ["Abbreviated Title", "Abbreviated Title"],
      showNav: false,
    },
  }
  state.entities.values = {
    CxGx7WMh2: {
      key: "CxGx7WMh2",
      propertyKey: "JQEtq-vmq8",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: "JQEtq-vmq8",
      literal: options.hasError ? null : "foo",
      lang: "eng",
      uri: null,
      label: null,
      valueSubjectKey: null,
      errors: options.hasError ? ["Literal required"] : [],
      component: "InputLiteralValue",
    },
  }
}

const buildTwoLiteralResources = (state, options) => {
  if (!options.hasTwoLiteralResources) return

  state.editor.currentResource = "t9zVwg2zO"
  state.editor.resources = ["t9zVwg2zO", "u0aWxh3a1"]
  state.entities.subjectTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle": {
      key: "ld4p:RT:bf2:Title:AbbrTitle",
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      class: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      author: "LD4P",
      date: "2019-08-19",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      ],
    },
    "ld4p:RT:bf2:Note": {
      key: "ld4p:RT:bf2:Note",
      id: "ld4p:RT:bf2:Note",
      class: "http://id.loc.gov/ontologies/bibframe/Note",
      label: "Note",
      author: "LD4P",
      date: "2019-08-19",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle":
      {
        key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        label: "Abbreviated Title",
        uri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
        required: false,
        repeatable: false,
        immutable: false,
        defaults: [],
        remarkUrl: null,
        type: "literal",
        component: "InputLiteral",
        authorities: [],
      },
    "ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note": {
      key: "ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note",
      subjectTemplateKey: "ld4p:RT:bf2:Note",
      label: "Note",
      uri: "http://id.loc.gov/ontologies/bibframe/note",
      required: false,
      repeatable: false,
      immutable: false,
      defaults: [],
      remarkUrl: null,
      type: "literal",
      component: "InputLiteral",
      authorities: [],
    },
  }
  state.entities.subjects = {
    t9zVwg2zO: {
      key: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: null,
      valueSubjectOfKey: null,
      uri: "https://api.sinopia.io/resource/0894a8b3",
      subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
      propertyKeys: ["JQEtq-vmq8"],
      changed: false,
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      descWithErrorPropertyKeys: [],
      group: "stanford",
      editGroups: ["cornell"],
      labels: ["Abbreviated Title"],
      label: "Abbreviated Title",
      showNav: false,
    },
    u0aWxh3a1: {
      key: "u0aWxh3a1",
      rootSubjectKey: "u0aWxh3a1",
      rootPropertyKey: null,
      valueSubjectOfKey: null,
      uri: "https://api.sinopia.io/resource/0704b9c4",
      subjectTemplateKey: "ld4p:RT:bf2:Note",
      propertyKeys: ["KRFur-wnr9"],
      changed: false,
      descUriOrLiteralValueKeys: ["DyHy8XNi3"],
      descWithErrorPropertyKeys: [],
      group: "stanford",
      editGroups: ["cornell"],
      labels: ["Note"],
      label: "Note",
      showNav: false,
    },
  }
  state.entities.properties = {
    "JQEtq-vmq8": {
      key: "JQEtq-vmq8",
      subjectKey: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: "JQEtq-vmq8",
      propertyTemplateKey:
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      valueKeys: ["CxGx7WMh2"],
      show: true,
      descUriOrLiteralValueKeys: ["CxGx7WMh2"],
      descWithErrorPropertyKeys: [],
      labels: ["Abbreviated Title", "Abbreviated Title"],
      showNav: false,
    },
    "KRFur-wnr9": {
      key: "KRFur-wnr9",
      subjectKey: "u0aWxh3a1",
      rootSubjectKey: "u0aWxh3a1",
      rootPropertyKey: "KRFur-wnr9",
      propertyTemplateKey:
        "ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note",
      valueKeys: ["DyHy8XNi3"],
      show: true,
      errors: [],
      descUriOrLiteralValueKeys: ["DyHy8XNi3"],
      descWithErrorPropertyKeys: [],
      labels: ["Note", "Note"],
      showNav: false,
    },
  }
  state.entities.values = {
    CxGx7WMh2: {
      key: "CxGx7WMh2",
      propertyKey: "JQEtq-vmq8",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: "JQEtq-vmq8",
      literal: "foo",
      lang: "eng",
      uri: null,
      label: null,
      valueSubjectKey: null,
      errors: [],
      component: "InputLiteralValue",
    },
    DyHy8XNi3: {
      key: "DyHy8XNi3",
      propertyKey: "KRFur-wnr9",
      rootSubjectKey: "u0aWxh3a1",
      rootPropertyKey: "KRFur-wnr9",
      literal: "This is a note",
      lang: "eng",
      uri: null,
      label: null,
      valueSubjectKey: null,
      errors: [],
      component: "InputLiteralValue",
    },
  }
}

const buildResourceWithUri = (state, options) => {
  if (!options.hasResourceWithUri) return

  state.editor.currentResource = "wihOjn-0Z"
  state.editor.resources = ["wihOjn-0Z"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber5": {
      key: "resourceTemplate:testing:uber5",
      uri: "http://localhost:3000/resource/resourceTemplate:testing:uber5",
      id: "resourceTemplate:testing:uber5",
      class: "http://id.loc.gov/ontologies/bibframe/Uber5",
      label: "Uber template5",
      author: null,
      remark: "Template for testing purposes with suppressed, repeatable URI.",
      date: null,
      suppressible: true,
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      ],
      group: "stanford",
      editGroups: ["cornell"],
    },
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1":
      {
        key: "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber5",
        label: "Uber template5, property1",
        uri: "http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
        required: false,
        repeatable: true,
        ordered: false,
        immutable: false,
        remark: "A repeatable URI",
        remarkUrl: null,
        defaults: [],
        valueSubjectTemplateKeys: [],
        authorities: [],
        type: "uri",
        component: "InputURI",
      },
  }

  state.entities.subjects = {
    FYPd18JgfhSGaeviY7NNu: {
      key: "FYPd18JgfhSGaeviY7NNu",
      uri: null,
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      descWithErrorPropertyKeys: [],
      subjectTemplateKey: "resourceTemplate:testing:uber5",
      valueSubjectOfKey: null,
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      rootPropertyKey: null,
      labels: ["Uber template5"],
      group: null,
      editGroups: [],
      bfAdminMetadataRefs: [],
      bfItemRefs: [],
      bfInstanceRefs: [],
      bfWorkRefs: [],
      propertyKeys: ["RPaGmJ_8IQi8roZ1oj1uK"],
      showNav: false,
    },
  }
  state.entities.properties = {
    RPaGmJ_8IQi8roZ1oj1uK: {
      key: "RPaGmJ_8IQi8roZ1oj1uK",
      show: false,
      subjectKey: "FYPd18JgfhSGaeviY7NNu",
      propertyTemplateKey:
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      descWithErrorPropertyKeys: [],
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      labels: ["Uber template5", "Uber template5, property1"],
      rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      valueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      showNav: false,
    },
  }
  state.entities.values = {
    "a_-Jp0pY6pH6ytCtfr-mx": {
      key: "a_-Jp0pY6pH6ytCtfr-mx",
      literal: null,
      lang: "eng",
      uri: "https://id.loc.gov/authorities/names/n81079286",
      label: "Kelsey, Michael R.",
      propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      valueSubjectKey: null,
      errors: [],
      component: "InputURIValue",
    },
  }
}

const buildResourceWithList = (state, options) => {
  if (!options.hasResourceWithList) return

  state.editor.currentResource = "wihOjn-0Z"
  state.editor.resources = ["wihOjn-0Z"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber5": {
      key: "resourceTemplate:testing:uber5",
      uri: "http://localhost:3000/resource/resourceTemplate:testing:uber5",
      id: "resourceTemplate:testing:uber5",
      class: "http://id.loc.gov/ontologies/bibframe/Uber5",
      label: "Uber template5",
      author: null,
      remark: "Template for testing purposes with repeatable list.",
      date: null,
      suppressible: true,
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      ],
      group: "stanford",
      editGroups: ["cornell"],
    },
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1":
      {
        key: "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber5",
        label: "Uber template5, property1",
        uri: "http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
        required: false,
        repeatable: true,
        ordered: false,
        immutable: false,
        remark: "A repeatable list",
        remarkUrl: null,
        defaults: [],
        valueSubjectTemplateKeys: [],
        authorities: [
          {
            uri: "https://id.loc.gov/vocabulary/mrectype",
            label: "type of recording",
            nonldLookup: false,
          },
        ],
        type: "uri",
        component: "InputList",
      },
  }

  state.entities.subjects = {
    FYPd18JgfhSGaeviY7NNu: {
      key: "FYPd18JgfhSGaeviY7NNu",
      uri: null,
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      descWithErrorPropertyKeys: [],
      subjectTemplateKey: "resourceTemplate:testing:uber5",
      valueSubjectOfKey: null,
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      rootPropertyKey: null,
      labels: ["Uber template5"],
      group: null,
      editGroups: [],
      bfAdminMetadataRefs: [],
      bfItemRefs: [],
      bfInstanceRefs: [],
      bfWorkRefs: [],
      propertyKeys: ["RPaGmJ_8IQi8roZ1oj1uK"],
      showNav: false,
    },
  }
  state.entities.properties = {
    RPaGmJ_8IQi8roZ1oj1uK: {
      key: "RPaGmJ_8IQi8roZ1oj1uK",
      show: false,
      subjectKey: "FYPd18JgfhSGaeviY7NNu",
      propertyTemplateKey:
        "resourceTemplate:testing:uber5 > http://id.loc.gov/ontologies/bibframe/uber/template5/property1",
      descUriOrLiteralValueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      descWithErrorPropertyKeys: [],
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      labels: ["Uber template5", "Uber template5, property1"],
      rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      valueKeys: ["a_-Jp0pY6pH6ytCtfr-mx"],
      showNav: false,
    },
  }
  state.entities.values = {
    "a_-Jp0pY6pH6ytCtfr-mx": {
      key: "a_-Jp0pY6pH6ytCtfr-mx",
      literal: null,
      lang: null,
      uri: null,
      label: null,
      propertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      rootSubjectKey: "FYPd18JgfhSGaeviY7NNu",
      rootPropertyKey: "RPaGmJ_8IQi8roZ1oj1uK",
      valueSubjectKey: null,
      errors: [],
      component: "InputListValue",
    },
  }
}

const buildResourceWithLookup = (state, options) => {
  if (!options.hasResourceWithLookup) return

  state.editor.currentResource = "wihOjn-0Z"
  state.editor.resources = ["wihOjn-0Z"]
  state.entities.subjectTemplates = {
    "test:resource:SinopiaLookup": {
      key: "test:resource:SinopiaLookup",
      id: "test:resource:SinopiaLookup",
      class: "http://id.loc.gov/ontologies/bibframe/Instance",
      label: "Testing sinopia lookup",
      author: null,
      remark: "This hits elasticsearch",
      date: null,
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf":
      {
        key: "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
        subjectTemplateKey: "test:resource:SinopiaLookup",
        label: "Instance of (lookup)",
        uri: "http://id.loc.gov/ontologies/bibframe/instanceOf",
        required: true,
        repeatable: false,
        immutable: false,
        remark: "lookup",
        remarkUrl: null,
        defaults: [],
        valueSubjectTemplateKeys: [],
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
      },
  }

  state.entities.subjects = {
    "wihOjn-0Z": {
      key: "wihOjn-0Z",
      uri: null,
      rootSubjectKey: "wihOjn-0Z",
      rootPropertyKey: null,
      valueSubjectOfKey: null,
      subjectTemplateKey: "test:resource:SinopiaLookup",
      group: null,
      editGroups: [],
      bfAdminMetadataRefs: [],
      bfItemRefs: [],
      bfInstanceRefs: [],
      bfWorkRefs: [
        "http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738",
      ],
      propertyKeys: ["i0SAJP-Zhd"],
      changed: true,
      descUriOrLiteralValueKeys: ["s8-qt3-uu"],
      descWithErrorPropertyKeys: [],
      labels: ["Testing sinopia lookup"],
      showNav: false,
    },
  }
  state.entities.properties = {
    "i0SAJP-Zhd": {
      key: "i0SAJP-Zhd",
      rootSubjectKey: "wihOjn-0Z",
      rootPropertyKey: "i0SAJP-Zhd",
      show: true,
      subjectKey: "wihOjn-0Z",
      propertyTemplateKey:
        "test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf",
      valueKeys: ["s8-qt3-uu"],
      descUriOrLiteralValueKeys: ["s8-qt3-uu"],
      descWithErrorPropertyKeys: [],
      labels: ["Testing sinopia lookup", "Instance of (lookup)"],
      showNav: false,
    },
  }
  state.entities.values = {
    "s8-qt3-uu": {
      key: "s8-qt3-uu",
      rootSubjectKey: "wihOjn-0Z",
      rootPropertyKey: "i0SAJP-Zhd",
      literal: null,
      lang: "eng",
      uri: "http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738",
      label: "How to Cook Everything Vegetarian",
      propertyKey: "i0SAJP-Zhd",
      valueSubjectKey: null,
      errors: [],
      component: "InputURIValue",
    },
  }
}

const buildResourceWithContractedLiteral = (state, options) => {
  if (!options.hasResourceWithContractedLiteral) return

  state.editor.currentResource = "t9zVwg2zO"
  state.editor.resources = ["t9zVwg2zO"]
  state.entities.subjectTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle": {
      key: "ld4p:RT:bf2:Title:AbbrTitle",
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      class: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      author: "LD4P",
      date: "2019-08-19",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle":
      {
        key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        label: "Abbreviated Title",
        uri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
        required: false,
        repeatable: false,
        immutable: false,
        defaults: [],
        remarkUrl: null,
        type: "literal",
        component: "InputLiteral",
        authorities: [],
      },
  }
  state.entities.subjects = {
    t9zVwg2zO: {
      key: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: null,
      valueSubjectOfKey: null,
      uri: "https://api.sinopia.io/resource/0894a8b3",
      subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
      propertyKeys: ["JQEtq-vmq8"],
      changed: false,
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
      editGroups: [],
      descUriOrLiteralValueKeys: [],
      descWithErrorPropertyKeys: [],
      labels: ["Abbreviated Title"],
      showNav: false,
    },
  }
  state.entities.properties = {
    "JQEtq-vmq8": {
      key: "JQEtq-vmq8",
      subjectKey: "t9zVwg2zO",
      rootSubjectKey: "t9zVwg2zO",
      rootPropertyKey: "JQEtq-vmq8",
      propertyTemplateKey:
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      valueKeys: null,
      show: true,
      descUriOrLiteralValueKeys: [],
      descWithErrorPropertyKeys: [],
      labels: ["Abbreviated Title", "Abbreviated Title"],
      showNav: false,
    },
  }
  state.entities.values = {}
}

const buildResourceWithNestedResource = (state, options) => {
  if (!options.hasResourceWithNestedResource) return

  state.editor.currentResource = "ljAblGiBW"
  state.editor.resources = ["ljAblGiBW"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber1": {
      key: "resourceTemplate:testing:uber1",
      id: "resourceTemplate:testing:uber1",
      class: "http://id.loc.gov/ontologies/bibframe/Uber1",
      label: "Uber template1",
      remark: "Template for testing purposes.",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      ],
    },
    "resourceTemplate:testing:uber2": {
      key: "resourceTemplate:testing:uber2",
      id: "resourceTemplate:testing:uber2",
      class: "http://id.loc.gov/ontologies/bibframe/Uber2",
      label: "Uber template2",
      remark:
        "Template for testing purposes with single repeatable literal with a link to Stanford at https://www.stanford.edu",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
      {
        key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber1",
        label: "Uber template1, property1",
        uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
        required: false,
        repeatable: true,
        immutable: false,
        defaults: [],
        remark: "Nested, repeatable resource template.",
        remarkUrl: null,
        type: "resource",
        component: "InputURI",
        valueSubjectTemplateKeys: ["resourceTemplate:testing:uber2"],
        authorities: [],
      },
    "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
      {
        key: "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber2",
        label: "Uber template2, property1",
        uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
        required: false,
        repeatable: true,
        immutable: false,
        defaults: [],
        remark: "A repeatable literal",
        remarkUrl: null,
        type: "literal",
        component: "InputLiteral",
        authorities: [],
      },
  }
  state.entities.subjects = {
    ljAblGiBW: {
      key: "ljAblGiBW",
      uri: null,
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: null,
      valueSubjectOfKey: null,
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      propertyKeys: ["v1o90QO1Qx"],
      changed: false,
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: "stanford",
      editGroups: ["cornell"],
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: ["Uber template1"],
      showNav: false,
    },
    XPb8jaPWo: {
      key: "XPb8jaPWo",
      uri: null,
      subjectTemplateKey: "resourceTemplate:testing:uber2",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      valueSubjectOfKey: "VDOeQCnFA8",
      propertyKeys: ["7caLbfwwle"],
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: ["Uber template1", "Uber template1, property1", "Uber template2"],
      showNav: false,
    },
  }
  state.entities.properties = {
    v1o90QO1Qx: {
      key: "v1o90QO1Qx",
      subjectKey: "ljAblGiBW",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      propertyTemplateKey:
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      valueKeys: ["VDOeQCnFA8"],
      show: true,
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: ["Uber template1", "Uber template1, property1"],
    },
    "7caLbfwwle": {
      key: "7caLbfwwle",
      subjectKey: "XPb8jaPWo",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      propertyTemplateKey:
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      valueKeys: ["pRJ0lO_mT-"],
      show: true,
      descUriOrLiteralValueKeys: ["pRJ0lO_mT-"],
      descWithErrorPropertyKeys: options.hasError ? ["7caLbfwwle"] : [],
      labels: [
        "Uber template1",
        "Uber template1, property1",
        "Uber template2",
        "Uber template2, property1",
      ],
      showNav: false,
    },
  }
  state.entities.values = {
    VDOeQCnFA8: {
      key: "VDOeQCnFA8",
      propertyKey: "v1o90QO1Qx",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      literal: null,
      lang: null,
      uri: null,
      label: null,
      valueSubjectKey: "XPb8jaPWo",
      errors: [],
      component: null,
    },
    "pRJ0lO_mT-": {
      key: "pRJ0lO_mT-",
      propertyKey: "7caLbfwwle",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      literal: options.hasError ? null : "foo",
      lang: "eng",
      uri: null,
      label: null,
      valueSubjectKey: null,
      errors: options.hasError ? ["Literal required"] : [],
      component: "InputLiteralValue",
    },
  }
}

const buildResourceWithContractedNestedResource = (state, options) => {
  if (!options.hasResourceWithContractedNestedResource) return

  state.editor.currentResource = "ljAblGiBW"
  state.editor.resources = ["ljAblGiBW"]
  state.entities.subjectTemplates = {
    "resourceTemplate:testing:uber1": {
      key: "resourceTemplate:testing:uber1",
      id: "resourceTemplate:testing:uber1",
      class: "http://id.loc.gov/ontologies/bibframe/Uber1",
      label: "Uber template1",
      remark: "Template for testing purposes.",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
      {
        key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber1",
        label: "Uber template1, property1",
        uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
        required: !!options.hasError,
        repeatable: true,
        immutable: false,
        defaults: [],
        remark: "Nested, repeatable resource template.",
        remarkUrl: null,
        type: "resource",
        component: "InputURI",
        valueSubjectTemplateKeys: ["resourceTemplate:testing:uber2"],
        authorities: [],
      },
  }
  state.entities.subjects = {
    ljAblGiBW: {
      key: "ljAblGiBW",
      uri: null,
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: null,
      valueSubjectOfKey: null,
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      propertyKeys: ["v1o90QO1Qx"],
      changed: false,
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
      editGroups: [],
      descUriOrLiteralValueKeys: [],
      descWithErrorPropertyKeys: [],
      labels: ["Uber template1"],
      showNav: false,
    },
  }
  state.entities.properties = {
    v1o90QO1Qx: {
      key: "v1o90QO1Qx",
      subjectKey: "ljAblGiBW",
      rootSubjectKey: "ljAblGiBW",
      rootPropertyKey: "v1o90QO1Qx",
      propertyTemplateKey:
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      valueKeys: null,
      show: true,
      descUriOrLiteralValueKeys: [],
      descWithErrorPropertyKeys: [],
      labels: ["Uber template1", "Uber template1, property1"],
      showNav: false,
    },
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
    "resourceTemplate:testing:uber1": {
      key: "resourceTemplate:testing:uber1",
      id: "resourceTemplate:testing:uber1",
      class: "http://id.loc.gov/ontologies/bibframe/Uber1",
      label: "Uber template1",
      remark: null,
      remarkUrl: "https://www.stanford.edu",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      ],
    },
    "resourceTemplate:testing:uber2": {
      key: "resourceTemplate:testing:uber2",
      id: "resourceTemplate:testing:uber2",
      class: "http://id.loc.gov/ontologies/bibframe/Uber2",
      label: "Uber template2",
      remark: "Template for testing purposes with single repeatable literal.",
      remarkUrl: "https://www.stanford.edu",
      group: "stanford",
      editGroups: ["cornell"],
      propertyTemplateKeys: [
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      ],
    },
  }
  state.entities.propertyTemplates = {
    "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1":
      {
        key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber1",
        label: "Uber template1, property1",
        uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
        required: false,
        repeatable: true,
        immutable: false,
        defaults: [],
        remark: "Nested, repeatable resource template.",
        remarkUrl: null,
        type: "resource",
        component: "InputURI",
        valueSubjectTemplateKeys: ["resourceTemplate:testing:uber2"],
        authorities: [],
      },
    "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
      {
        key: "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
        subjectTemplateKey: "resourceTemplate:testing:uber2",
        label: "Uber template2, property1",
        uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
        required: false,
        repeatable: true,
        immutable: false,
        defaults: [],
        remark: "A repeatable literal",
        remarkUrl: null,
        type: "literal",
        component: "InputLiteral",
        authorities: [],
      },
  }
  state.entities.subjects = {
    ljAblGiBW: {
      key: "ljAblGiBW",
      uri: null,
      resourceKey: "ljAblGiBW",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      propertyKeys: ["v1o90QO1Qx"],
      changed: false,
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
      editGroups: [],
      labels: ["Uber template1"],
      showNav: false,
    },
    XPb8jaPWo: {
      key: "XPb8jaPWo",
      uri: null,
      subjectTemplateKey: "resourceTemplate:testing:uber2",
      resourceKey: "ljAblGiBW",
      propertyKeys: ["7caLbfwwle"],
      labels: ["Uber template2"],
      showNav: false,
    },
    XPb8jaPWp: {
      key: "XPb8jaPWp",
      uri: null,
      subjectTemplateKey: "resourceTemplate:testing:uber2",
      resourceKey: "ljAblGiBW",
      propertyKeys: ["7caLbfwwlf"],
      labels: ["Uber template2"],
      showNav: false,
    },
  }
  state.entities.properties = {
    v1o90QO1Qx: {
      key: "v1o90QO1Qx",
      subjectKey: "ljAblGiBW",
      resourceKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      valueKeys: ["VDOeQCnFA8", "VDOeQCnFA9"],
      show: true,
      labels: ["Uber template1", "Uber template1, property1"],
      showNav: false,
    },
    "7caLbfwwle": {
      key: "7caLbfwwle",
      subjectKey: "XPb8jaPWo",
      resourceKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      valueKeys: ["pRJ0lO_mT-"],
      show: true,
      labels: ["Uber template2", "Uber template2, property1"],
      showNav: false,
    },
    "7caLbfwwlf": {
      key: "7caLbfwwlf",
      subjectKey: "XPb8jaPWp",
      resourceKey: "ljAblGiBW",
      propertyTemplateKey:
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
      valueKeys: ["pRJ0lO_mU-"],
      show: true,
      labels: ["Uber template2", "Uber template2, property1"],
      showNav: false,
    },
  }
  state.entities.values = {
    VDOeQCnFA8: {
      key: "VDOeQCnFA8",
      propertyKey: "v1o90QO1Qx",
      resourceKey: "ljAblGiBW",
      literal: null,
      lang: null,
      uri: null,
      label: null,
      valueSubjectKey: "XPb8jaPWo",
      component: null,
    },
    VDOeQCnFA9: {
      key: "VDOeQCnFA9",
      propertyKey: "v1o90QO1Qx",
      resourceKey: "ljAblGiBW",
      literal: null,
      lang: null,
      uri: null,
      label: null,
      valueSubjectKey: "XPb8jaPWp",
      component: null,
    },
    "pRJ0lO_mT-": {
      key: "pRJ0lO_mT-",
      propertyKey: "7caLbfwwle",
      resourceKey: "ljAblGiBW",
      literal: "foo",
      lang: "eng",
      uri: null,
      label: null,
      valueSubjectKey: null,
      component: "InputLiteralValue",
    },
    "pRJ0lO_mU-": {
      key: "pRJ0lO_mU-",
      propertyKey: "7caLbfwwlf",
      resourceKey: "ljAblGiBW",
      literal: "bar",
      lang: "eng",
      uri: null,
      label: null,
      valueSubjectKey: null,
      component: "InputLiteralValue",
    },
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
