// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Exports from 'components/exports/Exports'
import { renderWithReduxAndRouter, createReduxStore } from 'testUtils'

describe('Exports', () => {
  it('renders list of export files', async () => {
    const initialState = {
      selectorReducer: {
        entities: {
          exports: [
            'alberta_2019-10-28T16:44:08.978Z.zip',
            'boulder_2019-10-28T16:44:10.116Z.zip',
          ],
        },
        editor: {
          errors: {},
        },
        appVersion: {
          version: undefined,
          lastChecked: Date.now(),
        },
      },
    }
    const store = createReduxStore(initialState)
    const { getByText, container } = renderWithReduxAndRouter(
      <Exports />, store,
    )
    expect(getByText('Exports', { selector: 'h4' })).toBeInTheDocument()
    // No error message
    expect(container.querySelector('.alert-danger')).not.toBeInTheDocument()
    expect(getByText('alberta_2019-10-28T16:44:08.978Z.zip')).toBeInTheDocument()
    expect(getByText('boulder_2019-10-28T16:44:10.116Z.zip')).toBeInTheDocument()
  })

  it('renders errors', async () => {
    const initialState = {
      selectorReducer: {
        entities: {
          exports: [],
        },
        editor: {
          errors: {
            exports: ['AWS messed up'],
          },
        },
        appVersion: {
          version: undefined,
          lastChecked: Date.now(),
        },
      },
    }
    const store = createReduxStore(initialState)
    const { getByText, container } = renderWithReduxAndRouter(
      <Exports />, store,
    )
    expect(getByText('Exports', { selector: 'h4' })).toBeInTheDocument()
    expect(container.querySelector('.alert-danger')).toBeInTheDocument()
    expect(getByText('AWS messed up')).toBeInTheDocument()
  })
})
