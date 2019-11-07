// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import { renderWithRedux, createBlankState } from 'testUtils'
import Alerts from 'components/Alerts'
import appReducer from 'reducers/index'

describe('<Alerts />', () => {
  describe('when no errors', () => {
    const store = createStore(appReducer, createBlankState())
    it('does not render any alerts', () => {
      const { queryByText } = renderWithRedux(
        <Alerts errorKey="testerrorkey" />, store,
      )

      expect(queryByText(/×/)).not.toBeInTheDocument()
    })
  })

  describe('when there are errors', () => {
    it('renders alerts', () => {
      const state = createBlankState()
      state.selectorReducer.editor.errors.testerrorkey = ['Grrr...', 'Frick']

      const store = createStore(appReducer, state)
      const { queryAllByText, getByText } = renderWithRedux(
        <Alerts errorKey="testerrorkey" />, store,
      )

      // Two separate alerts
      expect(queryAllByText(/×/).length).toEqual(2)
      expect(getByText('Grrr...')).toBeInTheDocument()
      expect(getByText('Frick')).toBeInTheDocument()
    })
  })
})
