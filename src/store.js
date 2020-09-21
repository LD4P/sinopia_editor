// Copyright 2019 Stanford University see LICENSE for license

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers/index'
import Config from 'Config'

export const initialState = {
  authenticate: {
    user: undefined,
  },
  app: {
    version: undefined,
    lastChecked: Date.now(),
  },
  editor: { // The state of the editor
    content: {}, // State for content for input components. Allows communication between components, e.g, entering diacritics.
    copyToNewMessage: {
      oldUri: null,
      timestamp: null,
    },
    currentResource: undefined,
    currentComponent: {},
    diacritics: {
      show: false,
      key: null, // Key to link diacritic entry to component
      cursorOffset: null,
    },
    errors: {}, // {<error key>: [errors...]} or {<error key>: {<resourceKey>: [errors...]}}
    lastSave: {}, // {<resourceKey>: date}
    modal: {
      name: undefined, // Name of modal to show. Should only be one at a time.
      messages: [],
    },
    resources: [], // Subject keys for open resources
    resourceValidation: {}, // Show validation {<resourceKey>: boolean}
    unusedRDF: {}, // {<resourceKey>: rdf}
  },
  selectorReducer: {
    entities: { // The stuff we've retrieved from the server
      languages: { loading: false, options: [] },
      lookups: {},
      exports: [],
      subjectTemplates: {},
      propertyTemplates: {},
      subjects: {},
      properties: {},
      values: {},
    },
    search: {
      results: [],
      totalResults: 0,
      facetResults: [],
      query: undefined,
      options: {
        resultsPerPage: Config.searchResultsPerPage,
        startOfRange: 0, // 0 based
        sortField: undefined,
        sortOrder: undefined,
        typeFilter: undefined,
        groupFilter: undefined,
      },
      error: undefined,
    },
    templateSearch: {
      results: [],
      totalResults: 0,
      options: {
        resultsPerPage: Config.searchResultsPerPage,
        startOfRange: 0, // 0 based
      },
      error: undefined,
    },
    historicalTemplates: [],
  },
}

let composeEnhancers

if (process.env.NODE_ENV === 'development') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
} else {
  composeEnhancers = compose
}

const store = createStore(reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk)))

export default store
