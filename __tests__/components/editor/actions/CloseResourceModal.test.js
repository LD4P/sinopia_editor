// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import RDFModal from 'components/editor/actions/CloseResourceModal'
import { modalType } from 'selectors/modalSelectors'

describe('<CloseResourceModal />', () => {
  setupModal()
  const state = createBlankState()
  state.selectorReducer.editor.modal.name = 'CloseResourceModal'
  const store = createReduxStore(state)

  it('renders the <CloseResourceModal /> component as a Modal', async () => {
    const { getByTestId, getByText } = renderWithRedux(
      <RDFModal />,
      store,
    )
    expect(getByTestId('close-resource-modal')).toBeInTheDocument()

    expect(getByText(/Are you sure you want to close?/)).toBeInTheDocument()

    // has a close button
    expect(getByText('×')).toBeInTheDocument()

    // has a close button
    expect(getByText('Close', { selector: 'button' })).toBeInTheDocument()

    // has a close button
    expect(getByText('Cancel', { selector: 'button' })).toBeInTheDocument()

    expect(modalType(store.getState())).toBe('CloseResourceModal')
  })

  it('clicking cancel closes', async () => {
    const { getByText } = renderWithRedux(
      <RDFModal />,
      store,
    )
    fireEvent.click(getByText('Cancel'))

    await wait(() => {
      expect(modalType(store.getState())).toBe(undefined)
    })
  })

  it('clicking closes closes and invokes closeResource()', async () => {
    const mockCloseResource = jest.fn()
    const { getByText } = renderWithRedux(
      <RDFModal closeResource={mockCloseResource}/>,
      store,
    )
    fireEvent.click(getByText('Close'))

    await wait(() => {
      expect(modalType(store.getState())).toBe(undefined)
    })
    expect(mockCloseResource).toBeCalled()
  })
})
