
// Copyright 2019 Stanford University see LICENSE for license

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers/index'

const initialState = {
  selectorReducer: {
    appVersion: {
      version: undefined,
      lastChecked: Date.now(),
    },
    editor: { // The state of the editor
      displayValidations: false,
      errors: [],
      rdfPreview: {
        show: false,
      },
      resourceURIMessage: {
        show: false,
      },
      groupChoice: {
        show: false,
      },
      expanded: { // Should this node display as expanded in the editor (redux path organized)
      },
      resourceValidationErrors: { // Errors from validating resource (redux path organized)
      },
    },
    entities: { // The stuff we've retrieved from the server
      resourceTemplates: {},
      resourceTemplateSummaries: {},
      languages: { loading: false, options: [] },
      qa: { loading: false, options: [] },
    },
    resource: {}, // The state we're displaying in the editor
    search: {
      results: [],
      totalResults: 0,
      query: undefined,
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
