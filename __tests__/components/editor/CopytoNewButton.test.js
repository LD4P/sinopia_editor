// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import CopyToNewButton from 'components/editor/CopyToNewButton'
import appReducer from 'reducers/index'
import { renderWithRedux } from 'testUtils'
// import { waitForElement, wait } from '@testing-library/react'

test('Link button value of Copy', () => {
  const store = createStore(appReducer, {
    selectorReducer: {
      entities: {},
      resource: {},
      editor: {},
    },
  })
  const { queryByText } = renderWithRedux(
    <CopyToNewButton />, store,
  )
  expect(queryByText('Copy')).toBeInTheDocument()
})
