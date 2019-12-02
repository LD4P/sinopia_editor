// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import { renderWithRedux, createBlankState } from 'testUtils'
import SaveAlert from 'components/editor/SaveAlert'
import appReducer from 'reducers/index'


describe('<SaveAlert />', () => {
  describe('when lastSave is undefined', () => {
    const store = createStore(appReducer, createBlankState())
    const { queryByText } = renderWithRedux(
      <SaveAlert />, store,
    )

    it('does not render', () => {
      expect(queryByText('Saved')).not.toBeInTheDocument()
    })
  })

  describe('when it expired', () => {
    const state = createBlankState()
    state.selectorReducer.editor.lastSave = 12345
    const store = createStore(appReducer, state)

    const { queryByText } = renderWithRedux(
      <SaveAlert />, store,
    )

    it('is not displayed', () => {
      expect(queryByText('Saved')).not.toBeInTheDocument()
    })
  })
})
