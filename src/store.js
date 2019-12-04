// Copyright 2019 Stanford University see LICENSE for license

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers/index'
import Config from 'Config'

export const initialState = {
  selectorReducer: {
    appVersion: {
      version: undefined,
      lastChecked: Date.now(),
    },
    editor: { // The state of the editor
      currentResource: undefined,
      resourceValidation: {
        show: {}, // {<resourceKey>: boolean}
        errors: {}, // {<resource key>: [validation errors...]}
        errorsByPath: {}, // {<redux path...>: [validation errors ...]}
      },
      modal: {
        name: undefined, // Name of modal to show. Should only be one at a time.
        messages: [],
      },
      uploadTemplateMessages: [],
      resourceURIMessage: {
        show: false,
      },
      copyToNewMessage: {},
      expanded: {}, // Should this node display as expanded in the editor. {<redux path...>: boolean}}
      errors: {}, // {<error key>: [errors...]} or {<error key>: {<resourceKey>: [errors...]}}
      lastSave: {}, // {<resourceKey>: date}
      lastSaveChecksum: {}, // {<resourceKey>: checksum}
      unusedRDF: {}, // {<resourceKey>: rdf}
    },
    entities: { // The stuff we've retrieved from the server
      resources: {}, // The state we're displaying in the editor. {<resourceKey>: {<redux path ...>}}
      resourceTemplates: {},
      languages: { loading: false, options: [] },
      qa: { loading: false, options: [] },
      lookups: {},
      exports: [],
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
    historicalTemplates: {
      results: [],
      totalResults: 0,
      error: undefined,
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
