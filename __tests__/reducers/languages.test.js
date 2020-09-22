// Copyright 2020 Stanford University see LICENSE for license

import {
  languagesReceived, setLanguage,
} from 'reducers/languages'

import { createReducer } from 'reducers/index'
import { createState } from 'stateUtils'

const reducers = {
  LANGUAGE_SELECTED: setLanguage,
  LANGUAGES_RECEIVED: languagesReceived,
}
const reducer = createReducer(reducers)

describe('languagesReceived()', () => {
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
      languages: [],
    }

    const action = {
      type: 'LANGUAGES_RECEIVED',
      payload: lcLanguage,
    }

    const newState = reducer(oldState, action)
    expect(newState).toEqual({
      languages: [{ id: 'sna', label: 'Shona' }],
    })
  })
})

describe('setLanguage', () => {
  it('sets value language', () => {
    const oldState = createState({ hasResourceWithLiteral: true })
    const action = {
      type: 'LANGUAGE_SELECTED',
      payload: {
        valueKey: 'CxGx7WMh2',
        lang: 'spa',
      },
    }

    const newState = reducer(oldState.selectorReducer, action)
    expect(newState.entities.values.CxGx7WMh2.lang).toBe('spa')
  })
})
