// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'
import { initialState } from 'store'
import _ from 'lodash'

export const createState = (options = {}) => {
  const state = _.cloneDeep(initialState)
  buildAuthenticate(state, options)
  buildLanguages(state, options)
  buildResourceWithLiteral(state, options)
  buildTwoLiteralResources(state, options)
  buildResourceWithUri(state, options)
  buildResourceWithContractedLiteral(state, options)
  buildResourceWithNestedResource(state, options)
  buildResourceWithTwoNestedResources(state, options)
  buildResourceWithContractedNestedResource(state, options)
  buildResourceWithError(state, options)
  buildTemplateWithLiteral(state, options)
  buildExports(state, options)
  buildLookups(state, options)

  return state
}

const buildExports = (state, options) => {
  if (options.noExports) return

  state.selectorReducer.entities.exports = [
    'sinopia_export_all_2020-01-01T00:00:00.000Z.zip',
    'stanford_2020-01-01T00:00:00.000Z.zip',
  ]
}

const buildAuthenticate = (state, options) => {
  state.authenticate = { authenticationState: {} }

  if (options.notAuthenticated) return

  state.authenticate = {
    user: {
      username: 'Foo McBar',
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

const buildTemplateWithLiteral = (state, options) => {
  if (!options.hasTemplateWithLiteral) return

  state.selectorReducer.editor.currentResource = '8VrbxGPeF'
  state.selectorReducer.entities.subjectTemplates = {
    'sinopia:template:resource': {
      key: 'sinopia:template:resource',
        uri: 'http://localhost:3000/resource/sinopia:template:resource',
        id: 'sinopia:template:resource',
        'class': 'http://sinopia.io/vocabulary/ResourceTemplate',
        label: 'Resource Template (dummy)',
        author: null,
        remark: null,
        date: null,
        propertyTemplateKeys: [
        'sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label'
      ]
    }
  }
  state.selectorReducer.entities.propertyTemplates = {
    'sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label': {
      key: 'sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label',
        subjectTemplateKey: 'sinopia:template:resource',
        label: 'Note',
        uri: 'http://www.w3.org/2000/01/rdf-schema#label',
        required: false,
        repeatable: false,
        ordered: false,
        remark: null,
        remarkUrl: null,
        defaults: [],
        valueSubjectTemplateKeys: [],
        authorities: [],
        type: 'literal',
        component: 'InputLiteral'
    }
  }
  state.selectorReducer.entities.subjects = {
    '8VrbxGPeF': {
      key: '8VrbxGPeF',
        uri: 'http://localhost:3000/resource/sinopia:template:resource',
        resourceKey: '8VrbxGPeF',
        group: null,
        subjectTemplateKey: 'sinopia:template:resource',
        bfAdminMetadataRefs: [],
        bfItemRefs: [],
        bfInstanceRefs: [],
        bfWorkRefs: [],
        propertyKeys: [
        'mLi9ZqIjjx'
      ],
        changed: false,
        subjectTemplate: {
        key: 'sinopia:template:resource',
          uri: 'http://localhost:3000/resource/sinopia:template:resource',
          id: 'sinopia:template:resource',
          'class': 'http://sinopia.io/vocabulary/ResourceTemplate',
          label: 'Resource Template (dummy)',
          author: null,
          remark: null,
          date: null,
          propertyTemplateKeys: [
          'sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label'
        ]
      }
    }
  }
  state.selectorReducer.entities.properties = {
    mLi9ZqIjjx: {
      key: 'mLi9ZqIjjx',
        resourceKey: '8VrbxGPeF',
        show: true,
        subjectKey: '8VrbxGPeF',
        propertyTemplateKey: 'sinopia:template:resource > http://www.w3.org/2000/01/rdf-schema#label',
        errors: [],
        valueKeys: [
        'SgS9CqKjmb'
      ]
    }
  }
  state.selectorReducer.entities.values = {
    SgS9CqKjmb: {
      key: 'SgS9CqKjmb',
        resourceKey: '8VrbxGPeF',
        literal: 'Resource Template (dummy)',
        lang: '',
        uri: null,
        label: null,
        propertyKey: 'mLi9ZqIjjx',
        valueSubjectKey: null
    }
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
      uri: 'https://api.sinopia.io/resource/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
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
      errors: options.error || [],
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
      uri: 'https://api.sinopia.io/resource/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
      changed: false,
    },
    u0aWxh3a1: {
      key: 'u0aWxh3a1',
      resourceKey: 'u0aWxh3a1',
      uri: 'https://api.sinopia.io/resource/0704b9c4',
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

const buildResourceWithUri = (state, options) => {
  if (!options.hasResourceWithUri) return

  state.selectorReducer.editor.currentResource = 'wihOjn-0Z'
  state.selectorReducer.entities.subjectTemplates = {
    'test:resource:SinopiaLookup': {
      key: 'test:resource:SinopiaLookup',
      id: 'test:resource:SinopiaLookup',
      class: 'http://id.loc.gov/ontologies/bibframe/Instance',
      label: 'Testing sinopia lookup',
      author: null,
      remark: 'This hits elasticsearch',
      date: null,
      propertyTemplateKeys: [
        'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf': {
      key: 'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf',
      subjectTemplateKey: 'test:resource:SinopiaLookup',
      label: 'Instance of (lookup)',
      uri: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
      required: true,
      repeatable: false,
      remark: 'lookup',
      remarkUrl: null,
      defaults: [],
      valueSubjectTemplateKeys: [],
      authorities: [
        {
          uri: 'urn:ld4p:sinopia:bibframe:instance',
          label: 'Sinopia BIBFRAME instance resources',
          nonldLookup: false,
        },
        {
          uri: 'urn:ld4p:sinopia:bibframe:work',
          label: 'Sinopia BIBFRAME work resources',
          nonldLookup: false,
        },
      ],
      type: 'uri',
      component: 'InputLookupSinopia',
    },
  }

  state.selectorReducer.entities.subjects = {
    'wihOjn-0Z': {
      key: 'wihOjn-0Z',
      uri: null,
      resourceKey: 'wihOjn-0Z',
      subjectTemplateKey: 'test:resource:SinopiaLookup',
      group: null,
      bfAdminMetadataRefs: [],
      bfItemRefs: [],
      bfInstanceRefs: [],
      bfWorkRefs: [
        'http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738',
      ],
      propertyKeys: [
        'i0SAJP-Zhd',
      ],
      changed: true,
      subjectTemplate: {
        key: 'test:resource:SinopiaLookup',
        id: 'test:resource:SinopiaLookup',
        class: 'http://id.loc.gov/ontologies/bibframe/Instance',
        label: 'Testing sinopia lookup',
        author: null,
        remark: 'This hits elasticsearch',
        date: null,
        propertyTemplateKeys: [
          'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf',
        ],
      },
    },
  }
  state.selectorReducer.entities.properties = {
    'i0SAJP-Zhd': {
      key: 'i0SAJP-Zhd',
      resourceKey: 'wihOjn-0Z',
      show: true,
      subjectKey: 'wihOjn-0Z',
      propertyTemplateKey: 'test:resource:SinopiaLookup > http://id.loc.gov/ontologies/bibframe/instanceOf',
      errors: [],
      valueKeys: [
        's8-qt3-uu',
      ],
    },
  }
  state.selectorReducer.entities.values = {
    's8-qt3-uu': {
      key: 's8-qt3-uu',
      resourceKey: 'wihOjn-0Z',
      literal: null,
      lang: null,
      uri: 'http://localhost:3000/resource/74770f92-f8cf-48ee-970a-aefc97843738',
      label: 'foo',
      propertyKey: 'i0SAJP-Zhd',
      valueSubjectKey: null,
    },
  }
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
      uri: 'https://api.sinopia.io/resource/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
      changed: false,
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
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
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
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
      errors: options.error || [],
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
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
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

const buildLookups = (state, options) => {
  if (options.noLookups) return

  state.selectorReducer.entities.lookups = {
    'https://id.loc.gov/vocabulary/mrectype': [
      {
        id: 'EQhmzQNidXD',
        label: 'analog',
        uri: 'http://id.loc.gov/vocabulary/mrectype/analog',
      },
      {
        id: 'xrnwYKcpPws',
        label: 'digital',
        uri: 'http://id.loc.gov/vocabulary/mrectype/digital',
      },
    ],
    'https://id.loc.gov/vocabulary/mrecmedium': [
      {
        id: 'T06WuAcWutk',
        label: 'magnetic',
        uri: 'http://id.loc.gov/vocabulary/mrecmedium/mag',
      },
      {
        id: 'IbbEW9qnn-1',
        label: 'optical',
        uri: 'http://id.loc.gov/vocabulary/mrecmedium/opt',
      },
      {
        id: 'FIEXVtapJ6C',
        label: 'magneto-optical',
        uri: 'http://id.loc.gov/vocabulary/mrecmedium/magopt',
      },
    ],
  }
}

const buildResourceWithTwoNestedResources = (state, options) => {
  if (!options.hasResourceWithTwoNestedResources) return

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
      bfAdminMetadataRefs: [],
      bfInstanceRefs: [],
      bfItemRefs: [],
      bfWorkRefs: [],
      group: null,
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
    XPb8jaPWp: {
      key: 'XPb8jaPWp',
      uri: null,
      subjectTemplateKey: 'resourceTemplate:testing:uber2',
      resourceKey: 'ljAblGiBW',
      propertyKeys: [
        '7caLbfwwlf',
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
        'VDOeQCnFA9',
      ],
      show: true,
      errors: options.error || [],
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
    '7caLbfwwlf': {
      key: '7caLbfwwlf',
      subjectKey: 'XPb8jaPWp',
      resourceKey: 'ljAblGiBW',
      propertyTemplateKey: 'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      valueKeys: [
        'pRJ0lO_mU-',
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
    VDOeQCnFA9: {
      key: 'VDOeQCnFA9',
      propertyKey: 'v1o90QO1Qx',
      resourceKey: 'ljAblGiBW',
      literal: null,
      lang: null,
      uri: null,
      label: null,
      valueSubjectKey: 'XPb8jaPWp',
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
    'pRJ0lO_mU-': {
      key: 'pRJ0lO_mU-',
      propertyKey: '7caLbfwwlf',
      resourceKey: 'ljAblGiBW',
      literal: 'bar',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
  }
}


export const noop = () => {}
