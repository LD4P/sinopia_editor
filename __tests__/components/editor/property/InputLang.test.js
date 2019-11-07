// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import InputLang from 'components/editor/property/InputLang'
import { fireEvent } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'

const createInitialState = () => {
  const state = createBlankState()
  state.selectorReducer.resource = {
    'http://id.loc.gov/ontologies/bibframe/instanceOf': {
      content: '45678',
    },
  }
  state.selectorReducer.entities.languages = {
    options: [{
      id: 'en',
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
  reduxPath: ['resource', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
}

describe('<InputLang />', () => {
  const store = createReduxStore(createInitialState())
  setupModal()

  it('contains a label with the value of propertyLabel', () => {
    const { queryByText } = renderWithRedux(
      <InputLang {...plProps} />,
      store,
    )
    const expected = 'Select language for 45678'
    expect(queryByText(expected)).toBeInTheDocument()
  })

  it('change to match text changes input text', () => {
    const { getByRole } = renderWithRedux(
      <InputLang {...plProps} />,
      store,
    )
    const comboBox = getByRole('combobox', { hidden: true })
    fireEvent.change(comboBox, { target: { value: 'English' } })
    expect(comboBox.value).toBe('English')
  })
})
