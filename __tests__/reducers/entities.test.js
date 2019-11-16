// Copyright 2019 Stanford University see LICENSE for license

import {
  clearResourceTemplates, languagesReceived, loadingLanguages,
  copyResourceToEditor,
} from 'reducers/entities'
import { createReducer } from 'reducers/index'
import { createBlankState } from 'testUtils'
import shortid from 'shortid'

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
        languages: { loading: false, options: [] },
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
          options: [],
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
        '@id': 'http://id.loc.gov/vocabulary/iso639-2/sna',
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
          options: [{ id: 'sna', label: 'Shona' }],
        },
      },
    })
  })
})

describe('copyResourceToEditor', () => {
  shortid.generate = jest.fn().mockReturnValue('abc123')

  const resource = {
    'ld4p:RT:barcode': {
      resourceURI: 'https://sinopia.io/5678/',
    },
  }

  it('adds the resource with resourceURI removed', () => {
    const action = { payload: resource }
    const newState = copyResourceToEditor(createBlankState().selectorReducer, action)
    expect(newState.entities.resources.abc123).toEqual({
      'ld4p:RT:barcode': {},
    })
    expect(newState.editor.currentResource = 'abc123')
  })
})
