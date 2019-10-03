// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux } from 'testUtils'
import SaveAlert from 'components/editor/SaveAlert'
import appReducer from 'reducers/index'


describe('<SaveAlert />', () => {
  describe('when lastSave is undefined', () => {
    const store = createStore(appReducer, {
      selectorReducer: {
        editor: {
        },
      },
    })
    const { queryByText } = renderWithRedux(
      <SaveAlert skipTimer={true} />, store,
    )

    it('does not render', () => {
      expect(queryByText('Saved & Published ...')).not.toBeInTheDocument()
    })
  })

  describe('when lastSave is defined', () => {
    const store = createStore(appReducer, {
      selectorReducer: {
        editor: {
          lastSave: 12345,
        },
      },
    })

    const { queryByText } = renderWithRedux(
      <SaveAlert skipTimer={true} />, store,
    )

    it('renders', () => {
      expect(queryByText('Saved & Published ...')).not.toBeInTheDocument()
    })
  })
})
