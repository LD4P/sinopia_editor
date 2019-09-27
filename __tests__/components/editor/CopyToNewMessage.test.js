// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import CopyToNewMessage from 'components/editor/CopyToNewMessage'
import appReducer from 'reducers/index'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux } from 'testUtils'
import { getNodeText } from '@testing-library/react'

test('Message is not displayed when show is false', () => {
  const store = createStore(appReducer, {
    selectorReducer: {
      entities: {},
      resource: {},
      editor: {
        copyToNewMessage: {
          show: false,
        },
      },
    },
  })
  const { queryByText } = renderWithRedux(
    <CopyToNewMessage />, store,
  )
  expect(queryByText('Copied to new resource')).not.toBeInTheDocument()
})

test('Default message is displayed when show in state is true', () => {
  const store = createStore(appReducer, {
    selectorReducer: {
      entities: {},
      resource: {},
      editor: {
        copyToNewMessage: {
          show: true,
        },
      },
    },
  })
  const { container } = renderWithRedux(
    <CopyToNewMessage />, store,
  )
  expect(container.querySelector('.alert-info')).toBeInTheDocument()
})

test('Displays message with URI when URI is present in state', () => {
  const store = createStore(appReducer, {
    selectorReducer: {
      entities: {},
      resource: {},
      editor: {
        copyToNewMessage: {
          show: true,
          oldUri: 'https://sinopia.io/pcc/1345',
        },
      },
    },
  })
  const { container } = renderWithRedux(
    <CopyToNewMessage />, store,
  )
  expect(getNodeText(container.querySelector('.alert-info'))).toMatch('Copied https://sinopia.io/pcc/1345')
})
