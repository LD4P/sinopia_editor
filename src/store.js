// Copyright 2018 Stanford University see LICENSE for license

import { createStore } from 'redux'
import reducer from './reducers/index'

let store
const initialState = {
  selectorReducer: {
    editor: { // The state of the editor
      displayValidations: false,
      errors: [],
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

if (process.env.NODE_ENV === 'development') {
  store = createStore(reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
} else {
  store = createStore(reducer, initialState)
}

export default store
