// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import ExpiringMessage from 'components/editor/ExpiringMessage'
import appReducer from 'reducers/index'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux } from 'testUtils'

// A positve test is challenging to write, because the nominal behavior depends
// on this component rendering once, and then the passed in property changing.

it('is not displayed if it expired', () => {
  const store = createStore(appReducer, {})
  const { queryByText } = renderWithRedux(
    <ExpiringMessage timestamp={123}>Hello</ExpiringMessage>, store,
  )
  expect(queryByText('Hello')).not.toBeInTheDocument()
})
