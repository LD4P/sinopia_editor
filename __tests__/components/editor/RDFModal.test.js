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
    const { getByTestId } = renderWithRedux(
      <RDFModal />,
      store,
    )
    expect(getByTestId('rdf-modal')).toBeInTheDocument()
  })

  describe('header', () => {
    it('has a modal header', () => {
      const { getByTestId } = renderWithRedux(
        <RDFModal />,
        store,
      )
      expect(getByTestId('rdf-modal-header')).toBeInTheDocument()
    })

    it('has a close button', () => {
      const { getByText } = renderWithRedux(
        <RDFModal />,
        store,
      )
      expect(getByText('×')).toBeInTheDocument()
    })

    it('shows the RDF Preview title with the resource template id', () => {
      const { getByText } = renderWithRedux(
        <RDFModal />,
        store,
      )
      expect(getByText('RDF Preview')).toBeInTheDocument()
    })
  })

  describe('body', () => {
    it('has a save and publish button', () => {
      const { getByLabelText } = renderWithRedux(
        <RDFModal />,
        store,
      )
      expect(getByLabelText('Save')).toBeInTheDocument()
    })

    it('has a Modal.Body', () => {
      const { getByText } = renderWithRedux(
        <RDFModal />,
        store,
      )
      expect(getByText('If this looks good, then click Save and Publish')).toBeInTheDocument()
    })
  })
})
