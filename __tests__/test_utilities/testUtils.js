// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'

import React from 'react'
import { Provider } from 'react-redux'
// Will use for testing generated RDF.
import RDFModal from 'components/editor/RDFModal'
import { render, fireEvent } from '@testing-library/react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import appReducer from 'reducers/index'
import { MemoryRouter } from 'react-router-dom'
import { initialState } from 'store'
import _ from 'lodash'

import Honeybadger from 'honeybadger-js'
import ErrorBoundary from '@honeybadger-io/react'

const honeybadger = Honeybadger.configure({})

export const renderWithRedux = (ui, store) => {
  return {
    ...render(<ErrorBoundary honeybadger={honeybadger}><Provider store={store}>{ui}</Provider></ErrorBoundary>),
  }
}

// TODO maybe apply this to copyQASearchResult instead of inline memory router, also maybe add error boundry wrapper here
export const renderWithReduxAndRouter = (ui, store, initialEntries) => {
  return {
    ...render(
      <ErrorBoundary honeybadger={honeybadger}>
        <MemoryRouter initialEntries={initialEntries}>
          <Provider store={store}>{ui}</Provider>
        </MemoryRouter>
      </ErrorBoundary>,
    ),
  }
}

export const createReduxStore = (initialState) => {
  return createStore(appReducer, initialState, applyMiddleware(thunk))
}

export const assertRDF = async (store, triples) => {
  const { findByText, findByLabelText, unmount } = renderWithRedux(
    <RDFModal />, store,
  )

  fireEvent.change(await findByLabelText(/Format/), { target: { value: 'n-triples' } })
  await Promise.all(
    triples.map(async (triple) => {
      expect(await findByText(triple, { exact: false })).toBeInTheDocument()
    }),
  )
  unmount()
}

export const setupModal = () => {
  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', 'modal')
  document.body.appendChild(portalRoot)
}

export const createBlankState = (options = {}) => {
  const state = _.cloneDeep(initialState)
  state.authenticate = { authenticationState: {} }
  if (options.authenticated) {
    state.authenticate.authenticationState = {
      currentSession: {
        idToken: {},
      },
      currentUser: {
        username: 'Foo McBar',
      },
    }
  }
  return state
}
