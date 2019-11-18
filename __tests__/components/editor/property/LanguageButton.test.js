// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { fireEvent } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import LanguageButton from 'components/editor/property/LanguageButton'
import { modalType } from 'selectors/modalSelectors'

describe('When the user enters input into language modal', () => {
  setupModal()

  const createInitialState = () => {
    const state = createBlankState()
    state.selectorReducer.resource = {
      'resourceTemplate:bf2:Monograph:Instance': {
        'http://id.loc.gov/ontologies/bibframe/instanceOf': {
          content: '122345',
        },
      },
    }
    return state
  }

  const store = createReduxStore(createInitialState())
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
    fireEvent.click(getByText('Language: No language specified'))
    expect(modalType(store.getState())).toMatch('LanguageModal-resource,resourceTemplate:bf2:Monograph:Instance,http://id.loc.gov/ontologies/bibframe/instanceOf')
  })
})
