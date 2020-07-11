// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'
import { initialState } from 'store'
import _ from 'lodash'

export const createState = (options = {}) => {
  const state = _.cloneDeep(initialState)
  buildAuthenticate(state, options)
  buildLanguages(state, options)
  buildCurrentResource(state, options)

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

const buildCurrentResource = (state, options) => {
  if (!options.hasCurrentResource) return

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
      uri: 'https://trellis.sinopia.io/repository/washington/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
    },
  }
  state.selectorReducer.entities.properties = {
    'JQEtq-vmq8': {
      key: 'JQEtq-vmq8',
      subjectKey: 't9zVwg2zO',
      propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      valueKeys: [
        'CxGx7WMh2',
      ],
      show: true,
      errors: [],
    },
  }
  state.selectorReducer.entities.values = {
    CxGx7WMh2: {
      key: 'CxGx7WMh2',
      propertyKey: 'JQEtq-vmq8',
      literal: 'foo',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
  }
}

export const noop = () => {}
