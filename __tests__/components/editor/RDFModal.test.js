// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import RDFModal from 'components/editor/RDFModal'
import { modalType } from 'selectors/modalSelectors'

describe('<RDFModal />', () => {
  setupModal()
  const state = createBlankState()
  state.selectorReducer.editor.currentResource = 'abc123'
  state.selectorReducer.entities.resources.abc123 = {}
  const store = createReduxStore(state)

  it('renders the <RDFModal /> component as a Modal', async () => {
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
    expect(getByText('If this looks good, then click Save')).toBeInTheDocument()

    // Clicking the Save and Publish button closes the Modal
    fireEvent.click(getByLabelText('Save'))
    await wait(() => {
      expect(modalType(store.getState())).toBe(undefined)
    })
  })
})
