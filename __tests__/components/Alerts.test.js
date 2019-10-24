// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import { renderWithRedux } from 'testUtils'
import Alerts from 'components/Alerts'
import appReducer from 'reducers/index'

describe('<Alerts />', () => {
  describe('when no errors', () => {
    const store = createStore(appReducer, { selectorReducer: { editor: { errors: {} } } })
    it('does not render any alerts', () => {
      const { queryByText } = renderWithRedux(
        <Alerts errorKey="testerrorkey" />, store,
      )

      expect(queryByText(/×/)).not.toBeInTheDocument()
    })
  })

  describe('when there are errors', () => {
    it('renders alerts', () => {
      const state = {
        selectorReducer: {
          editor: {
            errors: {
              testerrorkey: ['Grrr...', 'Frick'],
            },
          },
        },
      }
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
