// Copyright 2019 Stanford University see LICENSE for license

import 'isomorphic-fetch'
import React from 'react'
import { renderWithReduxAndRouter, createReduxStore, setupModal } from 'testUtils'
import ImportResourceTemplate from 'components/templates/ImportResourceTemplate'

describe('<ImportResourceTemplate />', () => {
  const createInitialState = () => {
    return {
      selectorReducer: {
        appVersion: {
          version: '1.0',
        },
        editor: {
          copyToNewMessage: {},
          uploadTemplateMessages: [],
          modal: {
            messages: [],
            name: undefined,
          },
          resourceValidation: {
            show: false,
            errors: [],
            errorsByPath: {},
          },
          errors: {},
        },
        resource: {},
        templateSearch: {
          results: [],
          totalResults: 0,
          error: undefined,
        },
      },
    }
  }
  setupModal()

  const store = createReduxStore(createInitialState())
  const { getByText } = renderWithReduxAndRouter(
    <ImportResourceTemplate />,
    store,
  )

  it('draws the templates page', () => {
    expect(getByText('LINKED DATA EDITOR')).toBeInTheDocument()
    expect(getByText('Import a Profile or Resource Template')).toBeInTheDocument()
    expect(getByText('Find a resource template')).toBeInTheDocument()
  })
})
