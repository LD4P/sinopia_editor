// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import DiacriticsSelection from 'components/editor/diacritics/DiacriticsSelection'
import { fireEvent } from '@testing-library/react'
import { renderWithRedux, createBlankState, createReduxStore } from 'testUtils'

describe('DiacriticsSelection', () => {
  const state = createBlankState()
  state.selectorReducer.editor.diacritics.show = true
  state.selectorReducer.editor.diacritics.reduxPath = []
  const store = createReduxStore(state)

  it('shows a list of vocabularies to load', () => {
    const { getByText } = renderWithRedux(<DiacriticsSelection />, store)
    expect(getByText('Latin')).toBeInTheDocument()
    expect(getByText('Lao')).toBeInTheDocument()
  })

  it('loads a vocabulary and a list of character buttons is displayed', () => {
    const { getByText } = renderWithRedux(<DiacriticsSelection />, store)

    fireEvent.click(getByText('Latin'))
    expect(getByText('ñ')).toBeInTheDocument()
  })
})
