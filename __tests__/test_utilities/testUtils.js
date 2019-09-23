import React from 'react'
import { Provider } from 'react-redux'
// Will use for testing generated RDF.
import RDFModal from 'components/editor/RDFModal'
import { render } from '@testing-library/react'

export const renderWithRedux = (ui, store) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}

export const assertRDF = (store, triples) => {
  const { getByText } = renderWithRedux(
    <RDFModal />, store,
  )
  triples.forEach((triple) => {
    expect(getByText(triple, { exact: false })).toBeInTheDocument
  })
}
