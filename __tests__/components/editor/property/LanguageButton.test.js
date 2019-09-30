// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { fireEvent } from '@testing-library/react'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import LanguageButton from 'components/editor/property/LanguageButton'

describe('When the user enters input into language modal', () => {
  setupModal()

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
        'resourceTemplate:bf2:Monograph:Instance': {
          'http://id.loc.gov/ontologies/bibframe/instanceOf': {
            content: '122345',
          },
        },
      },
    },
  }
  const store = createReduxStore(state)
  const { getByText } = renderWithRedux(
    <LanguageButton
      reduxPath={[
        'resource',
        'resourceTemplate:bf2:Monograph:Instance',
        'http://id.loc.gov/ontologies/bibframe/instanceOf']}
      textValue={'12345'}
    />,
    store,
  )

  it('shows the <InputLang> modal when the <Button/> is clicked', async () => {
    fireEvent.click(getByText('Language:'))
  })
})
