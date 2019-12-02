// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { renderWithRedux, createReduxStore, createBlankState } from 'testUtils'
import NewsPanel from 'components/home/NewsPanel'

describe('<NewsPanel />', () => {
  it('renders', () => {
    const store = createReduxStore(createBlankState())
    const { queryByText } = renderWithRedux(
      <NewsPanel />, store,
    )
    expect(queryByText('Latest news')).toBeInTheDocument()
  })
})
