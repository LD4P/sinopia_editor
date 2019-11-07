// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import CopyToNewButton from 'components/editor/actions/CopyToNewButton'
import appReducer from 'reducers/index'
import { renderWithRedux, createBlankState } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'


test('Clicking copy link changes copyToNewMessage show', async () => {
  const store = createStore(appReducer, createBlankState())
  const { getByTitle } = renderWithRedux(
    <CopyToNewButton />, store,
  )
  fireEvent.click(getByTitle('Copy'))
  await wait(() => {
    expect(store.getState().selectorReducer.editor.copyToNewMessage.timestamp).toBeUndefined()
  })
})

test('Clicking copy link removes existing resourceId and saves oldUri to message', async () => {
  const state = createBlankState()
  state.selectorReducer.resource = {
    'ld4p:RT:bf2:WorkTitle': {
      resourceURI: 'http://platform:8080/repository/pcc/f006e8ae-8588-4f61-ae95-a0cdb16dedee',
    },
  }
  const store = createStore(appReducer, state)
  const { getByTitle } = renderWithRedux(
    <CopyToNewButton />, store,
  )
  fireEvent.click(getByTitle('Copy'))
  await wait(() => {
    const newState = store.getState()
    expect(newState.selectorReducer.resource['ld4p:RT:bf2:WorkTitle'].resourceURI).toBeFalsy()
    expect(newState.selectorReducer.editor.copyToNewMessage.oldUri).toBe('http://platform:8080/repository/pcc/f006e8ae-8588-4f61-ae95-a0cdb16dedee')
  })
})
