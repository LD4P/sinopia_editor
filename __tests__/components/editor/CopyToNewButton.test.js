// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import CopyToNewButton from 'components/editor/CopyToNewButton'
import appReducer from 'reducers/index'
/* eslint import/no-unresolved: 'off' */
import { renderWithRedux } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'

test('Link button value of Copy', () => {
  const store = createStore(appReducer, {
    selectorReducer: {
      entities: {},
      resource: {},
      editor: {},
    },
  })
  const { queryByText } = renderWithRedux(
    <CopyToNewButton />, store,
  )
  expect(queryByText('Copy')).toBeInTheDocument()
})

test('Clicking copy link changes copyToNewMessage show', async () => {
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
    <CopyToNewButton />, store,
  )
  fireEvent.click(queryByText('Copy'))
  await wait(() => {
    expect(store.getState().selectorReducer.editor.copyToNewMessage.show).toBeTruthy()
  })
})

test('Clicking copy link removes existing resourceId and saves oldUri to message', async () => {
  const store = createStore(appReducer, {
    selectorReducer: {
      entities: {},
      resource: {
        'ld4p:RT:bf2:WorkTitle': {
          resourceURI: 'http://platform:8080/repository/pcc/f006e8ae-8588-4f61-ae95-a0cdb16dedee',
        },
      },
      editor: {
        copyToNewMessage: {
          show: false,
        },
      },
    },
  })
  const { queryByText } = renderWithRedux(
    <CopyToNewButton />, store,
  )
  fireEvent.click(queryByText('Copy'))
  await wait(() => {
    const state = store.getState()
    expect(state.selectorReducer.resource['ld4p:RT:bf2:WorkTitle'].resourceURI).toBeFalsy()
    expect(state.selectorReducer.editor.copyToNewMessage.oldUri).toBe('http://platform:8080/repository/pcc/f006e8ae-8588-4f61-ae95-a0cdb16dedee')
  })
})
