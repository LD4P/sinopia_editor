// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import RDFModal from 'components/editor/RDFModal'

describe('<RDFModal />', () => {
  setupModal()

  const state = {
    selectorReducer: {
      editor: {
        rdfPreview: {
          show: true,
        },
      },
      resource: {},
    },
  }
  const store = createReduxStore(state)


  it('renders the <RDFModal /> component as a Modal', () => {
    const { getByLabelText, getByTestId, getByText } = renderWithRedux(
      <RDFModal />,
      store,
    )
    expect(getByTestId('rdf-modal')).toBeInTheDocument()

    // has a modal header
    expect(getByTestId('rdf-modal-header')).toBeInTheDocument()

    // has a close button
    expect(getByText('×')).toBeInTheDocument()

    // shows the RDF Preview title with the resource template id
    expect(getByText('RDF Preview')).toBeInTheDocument()

    // has a save and publish button
    expect(getByLabelText('Save')).toBeInTheDocument()

    // has a Modal.Body
    expect(getByText('If this looks good, then click Save and Publish')).toBeInTheDocument()
  })
})
