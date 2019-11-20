// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Exports from 'components/exports/Exports'
import { renderWithReduxAndRouter, createReduxStore, createBlankState } from 'testUtils'

describe('Exports', () => {
  it('renders list of export files', async () => {
    const state = createBlankState()
    state.selectorReducer.entities.exports = [
      'alberta_2019-10-28T16:44:08.978Z.zip',
      'boulder_2019-10-28T16:44:10.116Z.zip',
    ]

    const store = createReduxStore(state)
    const { getByText, container } = renderWithReduxAndRouter(
      <Exports />, store,
    )
    expect(getByText('Exports', { selector: 'h3' })).toBeInTheDocument()
    // No error message
    expect(container.querySelector('.alert-danger')).not.toBeInTheDocument()
    expect(getByText('alberta_2019-10-28T16:44:08.978Z.zip')).toBeInTheDocument()
    expect(getByText('boulder_2019-10-28T16:44:10.116Z.zip')).toBeInTheDocument()
  })

  it('renders errors', async () => {
    const state = createBlankState()
    state.selectorReducer.editor.errors.exports = ['AWS messed up']

    const store = createReduxStore(state)
    const { getByText, container } = renderWithReduxAndRouter(
      <Exports />, store,
    )
    expect(getByText('Exports', { selector: 'h3' })).toBeInTheDocument()
    expect(container.querySelector('.alert-danger')).toBeInTheDocument()
    expect(getByText('AWS messed up')).toBeInTheDocument()
  })
})
