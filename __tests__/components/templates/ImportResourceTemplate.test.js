// Copyright 2019 Stanford University see LICENSE for license

import 'isomorphic-fetch'
import React from 'react'
import {
  renderWithReduxAndRouter, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import ImportResourceTemplate from 'components/templates/ImportResourceTemplate'

describe('<ImportResourceTemplate />', () => {
  setupModal()

  const store = createReduxStore(createBlankState())
  const { getByText } = renderWithReduxAndRouter(
    <ImportResourceTemplate />,
    store,
  )

  it('draws the templates page', () => {
    expect(getByText('LINKED DATA EDITOR')).toBeInTheDocument()
    expect(getByText('Import Profile / Resource Template')).toBeInTheDocument()
    expect(getByText('Find a resource template')).toBeInTheDocument()
  })
})
