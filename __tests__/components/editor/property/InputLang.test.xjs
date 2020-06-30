// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import InputLang from 'components/editor/property/InputLang'
import { fireEvent } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'

const createInitialState = () => {
  const state = createBlankState()
  state.selectorReducer.entities.resources = {
    abc123: {
      'http://id.loc.gov/ontologies/bibframe/instanceOf': {
        content: '45678',
      },
    },
  },
  state.selectorReducer.entities.languages = {
    options: [{
      id: 'eng',
      label: 'English',
    }],
  }
  return state
}

const plProps = {
  id: '1223',
  propertyTemplate: {
    propertyLabel: 'Instance of',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
    type: 'literal',
  },
  loadLanguages: jest.fn(),
  options: [],
  reduxPath: ['entities', 'resources', 'abc123', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
}

describe('<InputLang />', () => {
  setupModal()
  const initialState = createInitialState()

  describe('when nothing has been selected', () => {
    it('contains a label with the value of propertyLabel', () => {
      const store = createReduxStore(initialState)

      const { queryByText } = renderWithRedux(
        <InputLang {...plProps} />,
        store,
      )
      const expected = 'Select language for 45678'
      expect(queryByText(expected)).toBeInTheDocument()
    })

    it('change to match text changes input text', () => {
      const store = createReduxStore(initialState)

      const { getByLabelText, getByRole } = renderWithRedux(
        <InputLang {...plProps} />,
        store,
      )
      const radio = getByLabelText(/No language specified/)
      expect(radio.checked).toBe(true)
      const comboBox = getByRole('combobox', { hidden: true })
      fireEvent.change(comboBox, { target: { value: 'English' } })
      expect(comboBox.value).toBe('English')
    })
  })

  describe('when English has been selected', () => {
    it('change to match text changes input text', () => {
      const state = { ...initialState }
      state.selectorReducer.entities.resources.abc123['http://id.loc.gov/ontologies/bibframe/instanceOf'].lang = 'en'
      const store = createReduxStore(state)

      const { getAllByLabelText } = renderWithRedux(
        <InputLang {...plProps} />,
        store,
      )
      const radio = getAllByLabelText(/Select language for 45678/)
      expect(radio[0].checked).toBe(true)
    })
  })
})
