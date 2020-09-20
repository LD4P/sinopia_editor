// Copyright 2020 Stanford University see LICENSE for license

import { showCopyNewMessage } from 'reducers/messages'
import { createReducer } from 'reducers/index'

describe('showCopyNewMessage()', () => {
  const handlers = { SHOW_COPY_NEW_MESSAGE: showCopyNewMessage }
  const reducer = createReducer(handlers)
  const realDateNow = Date.now.bind(global.Date)

  beforeAll(() => {
    const dateNowStub = jest.fn(() => 1594667068562)
    global.Date.now = dateNowStub
  })

  afterAll(() => {
    global.Date.now = realDateNow
  })

  it('copies new message when payload has an URI', () => {
    const oldState = {
      editor: {
        copyToNewMessage: {},
      },
    }
    const action = {
      type: 'SHOW_COPY_NEW_MESSAGE',
      payload: 'https://sinopia.io/stanford/1234',
    }

    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      editor: {
        copyToNewMessage: {
          timestamp: 1594667068562,
          oldUri: 'https://sinopia.io/stanford/1234',
        },
      },
    })
  })

  it('copies new message when payload is absent', () => {
    const oldState = {
      editor: {
        copyToNewMessage: {},
      },
    }
    const action = {
      type: 'SHOW_COPY_NEW_MESSAGE',
    }
    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      editor: {
        copyToNewMessage: {
          timestamp: 1594667068562,
        },
      },
    })
  })
})
