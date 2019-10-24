
// Copyright 2019 Stanford University see LICENSE for license

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers/index'
import Config from 'Config'

const initialState = {
  selectorReducer: {
    appVersion: {
      version: undefined,
      lastChecked: Date.now(),
    },
    editor: { // The state of the editor
      resourceValidation: {
        show: false,
        errors: [], // List of validation errors
        errorsByPath: {}, // Errors from validating resource (redux path organized)
      },
      modal: undefined, // Name of modal to show. Should only be one at a time.
      resourceURIMessage: {
        show: false,
      },
      copyToNewMessage: {},
      expanded: { // Should this node display as expanded in the editor (redux path organized)
      },
      retrieveResourceError: undefined,
      retrieveResourceTemplateError: undefined,
      saveResourceTemplateError: undefined,
      saveResourceError: undefined,
    },
    entities: { // The stuff we've retrieved from the server
      resourceTemplates: {},
      resourceTemplateSummaries: undefined,
      languages: { loading: false, options: [] },
      qa: { loading: false, options: [] },
      lookups: {},
    },
    resource: {}, // The state we're displaying in the editor
    search: {
      results: [],
      totalResults: 0,
      query: undefined,
      authority: undefined,
      error: undefined,
      resultsPerPage: Config.searchResultsPerPage,
      startOfRange: 0, // 0 based
      sortField: undefined,
      sortOrder: undefined,
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
