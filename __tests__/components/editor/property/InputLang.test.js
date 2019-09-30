// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import InputLang from 'components/editor/property/InputLang'
import { fireEvent } from '@testing-library/react'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'

const state = {
  selectorReducer: {
    entities: {
      languages: {
        options: [{
          id: 'en',
          label: 'English',
        }],
      },
    },
    resource: {
      'http://id.loc.gov/ontologies/bibframe/instanceOf': {
        content: '45678',
      },
    },
  },
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
  const store = createReduxStore(state)
  setupModal()

  it('contains a label with the value of propertyLabel', () => {
    const { queryByText } = renderWithRedux(
      <InputLang {...plProps} />,
      store,
    )
    const expected = 'Select language for 45678'
    expect(queryByText(expected)).toBeInTheDocument()
  })

  it('typeahead component exists', () => {
    const { getByRole } = renderWithRedux(
      <InputLang {...plProps} />,
      store,
    )
    expect(getByRole('combobox')).toBeInTheDocument()
  })

  it('change to match text changes input text', async () => {
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    })

    const { getByRole } = renderWithRedux(
      <InputLang {...plProps} />,
      store,
    )
    fireEvent.change(getByRole('combobox'), { target: { value: 'English' } })
    const comboBox = getByRole('combobox')
    expect(comboBox.value).toBe('English')
  })
})
