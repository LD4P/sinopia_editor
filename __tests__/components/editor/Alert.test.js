// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import { renderWithRedux } from 'testUtils'
import Alert from 'components/Alert'
import appReducer from 'reducers/index'

describe('<Alert />', () => {
  const store = createStore(appReducer, {})
  describe('when text is undefined', () => {
    it('does not render', () => {
      const { queryByText } = renderWithRedux(
        <Alert text={null}/>, store,
      )

      expect(queryByText(/×/)).not.toBeInTheDocument()
    })
  })

  describe('when text is defined', () => {
    it('does not render', () => {
      const { queryByText } = renderWithRedux(
        <Alert text="Hello"/>, store,
      )

      expect(queryByText(/×/)).toBeInTheDocument()
      expect(queryByText(/Hello/)).toBeInTheDocument()
    })
  })
})
