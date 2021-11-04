// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { Provider } from "react-redux"
import { render } from "@testing-library/react"
import { createStore as createReduxStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import appReducer from "reducers/index"
import { Router } from "react-router-dom"
import { createMemoryHistory } from "history"
import _ from "lodash"
import App from "components/App"
import { createState } from "./stateUtils"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"

export const renderApp = (store, history) => {
  return renderComponent(<App />, store, history)
}

export const renderComponent = (
  component,
  store,
  history,
  { errorKey = null } = {}
) => {
  setupModal()
  return {
    ...render(
      <Router history={history || createHistory()}>
        <Provider store={store || createStore()}>
          <AlertsContextProvider value={errorKey || "testErrorKey"}>
            {component}
          </AlertsContextProvider>
        </Provider>
      </Router>
    ),
  }
}

export const createStore = (initialState) => {
  return createReduxStore(
    appReducer,
    initialState || createState(),
    applyMiddleware(thunk)
  )
}

export const createHistory = (initialEntries) => {
  const history = createMemoryHistory()
  if (!_.isEmpty(initialEntries)) {
    initialEntries.forEach((initialEntry) => {
      history.push(initialEntry)
    })
  }
  return history
}

export const setupModal = () => {
  const portalRoot = document.createElement("div")
  portalRoot.setAttribute("id", "modal")
  document.body.appendChild(portalRoot)
}
