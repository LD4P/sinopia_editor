// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'
import { initialState } from 'store'
import _ from 'lodash'

export const createState = (options = {}) => {
  const state = _.cloneDeep(initialState)
  buildAuthenticate(state, options)
  buildLanguages(state, options)
  buildResourceWithLiteral(state, options)
  buildTwoLiteralResources(state, options)
  buildResourceWithContractedLiteral(state, options)
  buildResourceWithNestedResource(state, options)
  buildResourceWithContractedNestedResource(state, options),
  buildResourceWithError(state, options)

  return state
}

const buildAuthenticate = (state, options) => {
  state.authenticate = { authenticationState: {} }

  if (options.notAuthenticated) return

  state.authenticate.authenticationState = {
    currentSession: {
      idToken: {},
    },
    currentUser: {
      username: 'Foo McBar',
      globalSignOut: (resultHandler) => { resultHandler.onSuccess() },
    },
  }
}

const buildLanguages = (state, options) => {
  if (options.noLanguage) return

  state.selectorReducer.entities.languages.options = [
    { id: 'tai', label: 'Tai languages' },
    { id: 'eng', label: 'English' },
  ]
}

const buildResourceWithError = (state, options) => {
  if (!options.hasResourceWithError) return

  state.selectorReducer.editor = {
    resourceValidation: {
      show: {
        '3h4Fp8ANu': true,
      },
    },
    errors: {
      '3h4Fp8ANu': ['error 1', 'error 2'],
      lkqatmo20: {
        dairdj42u: ['error 3'],
        fQMouMqB0: ['error 4'],
      },
    },
  }
}

const buildResourceWithLiteral = (state, options) => {
  if (!options.hasResourceWithLiteral) return

  state.selectorReducer.editor.currentResource = 't9zVwg2zO'
  state.selectorReducer.entities.subjectTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle',
      id: 'ld4p:RT:bf2:Title:AbbrTitle',
      class: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
      label: 'Abbreviated Title',
      author: 'LD4P',
      date: '2019-08-19',
      propertyTemplateKeys: [
        'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      label: 'Abbreviated Title',
      uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
      required: false,
      repeatable: false,
      defaults: [],
      remarkUrl: null,
      type: 'literal',
      component: 'InputLiteral',
      authorities: [],
    },
  }
  state.selectorReducer.entities.subjects = {
    t9zVwg2zO: {
      key: 't9zVwg2zO',
      resourceKey: 't9zVwg2zO',
      uri: 'https://trellis.sinopia.io/repository/washington/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
      changed: false,
    },
  }
  state.selectorReducer.entities.properties = {
    'JQEtq-vmq8': {
      key: 'JQEtq-vmq8',
      subjectKey: 't9zVwg2zO',
      resourceKey: 't9zVwg2zO',
      propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      valueKeys: [
        'CxGx7WMh2',
      ],
      show: true,
      errors: ['error 1'],
    },
  }
  state.selectorReducer.entities.values = {
    CxGx7WMh2: {
      key: 'CxGx7WMh2',
      propertyKey: 'JQEtq-vmq8',
      resourceKey: 't9zVwg2zO',
      literal: 'foo',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
  }
}

const buildTwoLiteralResources = (state, options) => {
  if (!options.hasTwoLiteralResources) return

  state.selectorReducer.editor.currentResource = 't9zVwg2zO'
  state.selectorReducer.entities.subjectTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle',
      id: 'ld4p:RT:bf2:Title:AbbrTitle',
      class: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
      label: 'Abbreviated Title',
      author: 'LD4P',
      date: '2019-08-19',
      propertyTemplateKeys: [
        'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      ],
    },
    'ld4p:RT:bf2:Note': {
      key: 'ld4p:RT:bf2:Note',
      id: 'ld4p:RT:bf2:Note',
      class: 'http://id.loc.gov/ontologies/bibframe/Note',
      label: 'Note',
      author: 'LD4P',
      date: '2019-08-19',
      propertyTemplateKeys: [
        'ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      label: 'Abbreviated Title',
      uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
      required: false,
      repeatable: false,
      defaults: [],
      remarkUrl: null,
      type: 'literal',
      component: 'InputLiteral',
      authorities: [],
    },
    'ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note': {
      key: 'ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note',
      subjectTemplateKey: 'ld4p:RT:bf2:Note',
      label: 'Note',
      uri: 'http://id.loc.gov/ontologies/bibframe/note',
      required: false,
      repeatable: false,
      defaults: [],
      remarkUrl: null,
      type: 'literal',
      component: 'InputLiteral',
      authorities: [],
    },
  }
  state.selectorReducer.entities.subjects = {
    t9zVwg2zO: {
      key: 't9zVwg2zO',
      resourceKey: 't9zVwg2zO',
      uri: 'https://trellis.sinopia.io/repository/washington/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
      changed: false,
    },
    u0aWxh3a1: {
      key: 'u0aWxh3a1',
      resourceKey: 'u0aWxh3a1',
      uri: 'https://trellis.sinopia.io/repository/washington/0704b9c4',
      subjectTemplateKey: 'ld4p:RT:bf2:Note',
      propertyKeys: [
        'KRFur-wnr9',
      ],
      changed: false,
    },
  }
  state.selectorReducer.entities.properties = {
    'JQEtq-vmq8': {
      key: 'JQEtq-vmq8',
      subjectKey: 't9zVwg2zO',
      resourceKey: 't9zVwg2zO',
      propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      valueKeys: [
        'CxGx7WMh2',
      ],
      show: true,
      errors: [],
    },
    'KRFur-wnr9': {
      key: 'KRFur-wnr9',
      subjectKey: 'u0aWxh3a1',
      resourceKey: 'u0aWxh3a1',
      propertyTemplateKey: 'ld4p:RT:bf2:Note > http://id.loc.gov/ontologies/bibframe/note',
      valueKeys: [
        'DyHy8XNi3',
      ],
      show: true,
      errors: [],
    },
  }
  state.selectorReducer.entities.values = {
    CxGx7WMh2: {
      key: 'CxGx7WMh2',
      propertyKey: 'JQEtq-vmq8',
      resourceKey: 't9zVwg2zO',
      literal: 'foo',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
    DyHy8XNi3: {
      key: 'DyHy8XNi3',
      propertyKey: 'KRFur-wnr9',
      resourceKey: 'u0aWxh3a1',
      literal: 'This is a note',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
  }
  state.selectorReducer.editor.resources = ['t9zVwg2zO', 'u0aWxh3a1']
}

const buildResourceWithContractedLiteral = (state, options) => {
  if (!options.hasResourceWithContractedLiteral) return

  state.selectorReducer.editor.currentResource = 't9zVwg2zO'
  state.selectorReducer.entities.subjectTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle',
      id: 'ld4p:RT:bf2:Title:AbbrTitle',
      class: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
      label: 'Abbreviated Title',
      author: 'LD4P',
      date: '2019-08-19',
      propertyTemplateKeys: [
        'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      label: 'Abbreviated Title',
      uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
      required: false,
      repeatable: false,
      defaults: [],
      remarkUrl: null,
      type: 'literal',
      component: 'InputLiteral',
      authorities: [],
    },
  }
  state.selectorReducer.entities.subjects = {
    t9zVwg2zO: {
      key: 't9zVwg2zO',
      resourceKey: 't9zVwg2zO',
      uri: 'https://trellis.sinopia.io/repository/washington/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
      changed: false,
    },
  }
  state.selectorReducer.entities.properties = {
    'JQEtq-vmq8': {
      key: 'JQEtq-vmq8',
      subjectKey: 't9zVwg2zO',
      resourceKey: 't9zVwg2zO',
      propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      valueKeys: null,
      show: true,
      errors: [],
    },
  }
  state.selectorReducer.entities.values = {}
}

const buildResourceWithNestedResource = (state, options) => {
  if (!options.hasResourceWithNestedResource) return

  state.selectorReducer.editor.currentResource = 'ljAblGiBW'
  state.selectorReducer.entities.subjectTemplates = {
    'resourceTemplate:testing:uber1': {
      key: 'resourceTemplate:testing:uber1',
      id: 'resourceTemplate:testing:uber1',
      class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
      label: 'Uber template1',
      remark: 'Template for testing purposes.',
      propertyTemplateKeys: [
        'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      ],
    },
    'resourceTemplate:testing:uber2': {
      key: 'resourceTemplate:testing:uber2',
      id: 'resourceTemplate:testing:uber2',
      class: 'http://id.loc.gov/ontologies/bibframe/Uber2',
      label: 'Uber template2',
      remark: 'Template for testing purposes with single repeatable literal.',
      propertyTemplateKeys: [
        'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1': {
      key: 'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      subjectTemplateKey: 'resourceTemplate:testing:uber1',
      label: 'Uber template1, property1',
      uri: 'http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      required: false,
      repeatable: true,
      defaults: [],
      remark: 'Nested, repeatable resource template.',
      remarkUrl: null,
      type: 'resource',
      component: 'InputURI',
      valueSubjectTemplateKeys: [
        'resourceTemplate:testing:uber2',
      ],
      authorities: [],
    },
    'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1': {
      key: 'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      subjectTemplateKey: 'resourceTemplate:testing:uber2',
      label: 'Uber template2, property1',
      uri: 'http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      required: false,
      repeatable: true,
      defaults: [],
      remark: 'A repeatable literal',
      remarkUrl: null,
      type: 'literal',
      component: 'InputLiteral',
      authorities: [],
    },
  }
  state.selectorReducer.entities.subjects = {
    ljAblGiBW: {
      key: 'ljAblGiBW',
      uri: null,
      resourceKey: 'ljAblGiBW',
      subjectTemplateKey: 'resourceTemplate:testing:uber1',
      propertyKeys: [
        'v1o90QO1Qx',
      ],
      changed: false,
    },
    XPb8jaPWo: {
      key: 'XPb8jaPWo',
      uri: null,
      subjectTemplateKey: 'resourceTemplate:testing:uber2',
      resourceKey: 'ljAblGiBW',
      propertyKeys: [
        '7caLbfwwle',
      ],
    },
  }
  state.selectorReducer.entities.properties = {
    v1o90QO1Qx: {
      key: 'v1o90QO1Qx',
      subjectKey: 'ljAblGiBW',
      resourceKey: 'ljAblGiBW',
      propertyTemplateKey: 'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      valueKeys: [
        'VDOeQCnFA8',
      ],
      show: true,
      errors: ['error 2'],
    },
    '7caLbfwwle': {
      key: '7caLbfwwle',
      subjectKey: 'XPb8jaPWo',
      resourceKey: 'ljAblGiBW',
      propertyTemplateKey: 'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      valueKeys: [
        'pRJ0lO_mT-',
      ],
      show: true,
      errors: [],
    },
  }
  state.selectorReducer.entities.values = {
    VDOeQCnFA8: {
      key: 'VDOeQCnFA8',
      propertyKey: 'v1o90QO1Qx',
      resourceKey: 'ljAblGiBW',
      literal: null,
      lang: null,
      uri: null,
      label: null,
      valueSubjectKey: 'XPb8jaPWo',
    },
    'pRJ0lO_mT-': {
      key: 'pRJ0lO_mT-',
      propertyKey: '7caLbfwwle',
      resourceKey: 'ljAblGiBW',
      literal: 'foo',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
  }
}

const buildResourceWithContractedNestedResource = (state, options) => {
  if (!options.hasResourceWithContractedNestedResource) return

  state.selectorReducer.editor.currentResource = 'ljAblGiBW'
  state.selectorReducer.entities.subjectTemplates = {
    'resourceTemplate:testing:uber1': {
      key: 'resourceTemplate:testing:uber1',
      id: 'resourceTemplate:testing:uber1',
      class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
      label: 'Uber template1',
      remark: 'Template for testing purposes.',
      propertyTemplateKeys: [
        'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1': {
      key: 'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      subjectTemplateKey: 'resourceTemplate:testing:uber1',
      label: 'Uber template1, property1',
      uri: 'http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      required: false,
      repeatable: true,
      defaults: [],
      remark: 'Nested, repeatable resource template.',
      remarkUrl: null,
      type: 'resource',
      component: 'InputURI',
      valueSubjectTemplateKeys: [
        'resourceTemplate:testing:uber2',
      ],
      authorities: [],
    },
  }
  state.selectorReducer.entities.subjects = {
    ljAblGiBW: {
      key: 'ljAblGiBW',
      uri: null,
      resourceKey: 'ljAblGiBW',
      subjectTemplateKey: 'resourceTemplate:testing:uber1',
      propertyKeys: [
        'v1o90QO1Qx',
      ],
      changed: false,
    },
  }
  state.selectorReducer.entities.properties = {
    v1o90QO1Qx: {
      key: 'v1o90QO1Qx',
      subjectKey: 'ljAblGiBW',
      resourceKey: 'ljAblGiBW',
      propertyTemplateKey: 'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      valueKeys: null,
      show: true,
      errors: [],
    },
  }
  state.selectorReducer.entities.values = {}
}


export const noop = () => {}
