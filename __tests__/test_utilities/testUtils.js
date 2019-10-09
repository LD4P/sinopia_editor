import React from 'react'
import { Provider } from 'react-redux'
// Will use for testing generated RDF.
import RDFModal from 'components/editor/RDFModal'
import { render } from '@testing-library/react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import appReducer from 'reducers/index'

export const renderWithRedux = (ui, store) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}

export const createReduxStore = (initialState) => {
  return createStore(appReducer, initialState, applyMiddleware(thunk))
}

export const assertRDF = (store, triples) => {
  // For this to work, show for rdfPreview must be set to true
  expect(store.getState().selectorReducer.editor.rdfPreview.show).toBe(true)
  const { getByText } = renderWithRedux(
    <RDFModal />, store,
  )
  triples.forEach((triple) => {
    expect(getByText(triple, { exact: false })).toBeInTheDocument()
  })
}
