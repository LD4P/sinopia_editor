// Copyright 2019 Stanford University see LICENSE for license

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers/index'

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
    historicalTemplates: [],
    lastSave: {}, // {<resourceKey>: date}
    modal: {
      name: undefined, // Name of modal to show. Should only be one at a time.
      messages: [],
    },
    resources: [], // Subject keys for open resources
    resourceValidation: {}, // Show validation {<resourceKey>: boolean}
    unusedRDF: {}, // {<resourceKey>: rdf}
  },
  entities: {
    languages: [],
    lookups: {},
  },
  search: {
    // Search model:
    // {
    //   results: [],
    //   totalResults: 0,
    //   facetResults: {},
    //   query: undefined,
    //   options: {
    //     resultsPerPage: Config.searchResultsPerPage,
    //     startOfRange: 0, // 0 based
    //     sortField: undefined,
    //     sortOrder: undefined,
    //     typeFilter: undefined,
    //     groupFilter: undefined,
    //   },
    //   error: undefined,
    // },
    resource: null,
    template: null,
  },
  selectorReducer: {
    entities: { // The stuff we've retrieved from the server
      exports: [],
      subjectTemplates: {},
      propertyTemplates: {},
      subjects: {},
      properties: {},
      values: {},
    },
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
