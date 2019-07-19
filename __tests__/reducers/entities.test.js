// Copyright 2019 Stanford University see LICENSE for license

import {
  clearResourceTemplates, languagesReceived, loadingLanguages,
} from 'reducers/entities'
import { createReducer } from 'reducers/index'

describe('clearResourceTemplates', () => {
  const handlers = { CLEAR_RESOURCE_TEMPLATES: clearResourceTemplates }
  const reducer = createReducer(handlers)

  it('removes all resource templates', () => {
    const oldState = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Instance': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          },
        },
      },
    }

    const action = {
      type: 'CLEAR_RESOURCE_TEMPLATES',
    }

    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      entities: {
        resourceTemplates: {},
      },
    })
  })
})

describe('loadingLanguages', () => {
  const handlers = { LOADING_LANGUAGES: loadingLanguages }
  const reducer = createReducer(handlers)

  it('creates loading boolean', () => {
    const oldState = {
      entities: {
        resourceTemplates: {},
      },
    }

    const action = {
      type: 'LOADING_LANGUAGES',
    }

    const newState = reducer(oldState, action)
    expect(newState).toEqual({
      entities: {
        resourceTemplates: {},
        languages: {
          loading: true,
        },
      },
    })
  })
})

describe('languagesReceived', () => {
  const handlers = { LANGUAGES_RECEIVED: languagesReceived }
  const reducer = createReducer(handlers)

  it('creates a hash of options that it renders in the form field', () => {
    const lcLanguage = [
      {
        '@id': 'http://id.loc.gov/vocabulary/iso639-1/sn',
        'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [
          {
            '@language': 'en',
            '@value': 'Shona',
          },
        ],
      },
      {
        '@id': 'http://id.loc.gov/vocabulary/languages/oops',
      },
    ]

    const oldState = {
      entities: {
        resourceTemplates: {},
      },
    }

    const action = {
      type: 'LANGUAGES_RECEIVED',
      payload: lcLanguage,
    }

    const newState = reducer(oldState, action)
    expect(newState).toEqual({
      entities: {
        resourceTemplates: {},
        languages: {
          loading: false,
          options: [{ id: 'sn', label: 'Shona' }],
        },
      },
    })
  })
})
