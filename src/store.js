// Copyright 2019 Stanford University see LICENSE for license

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers/index'

const initialState = {
  selectorReducer: {
    editor: { // The state of the editor
      displayValidations: false,
      errors: [],
      rdfPreview: {
        show: false,
      },
      baseURL: {
        show: false,
      },
      groupChoice: {
        show: false,
      },
    },
    entities: { // The stuff we've retrieved from the server
      resourceTemplates: {
      },
    },
    resource: { // The state we're displaying in the editor
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
