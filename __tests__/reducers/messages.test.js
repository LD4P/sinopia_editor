// Copyright 2020 Stanford University see LICENSE for license

import {
  clearTemplateMessages, setTemplateMessages, showCopyNewMessage,
} from 'reducers/messages'
import { createReducer } from 'reducers/index'


describe('clearTemplateMessages()', () => {
  const handlers = { CLEAR_TEMPLATE_MESSAGES: clearTemplateMessages }
  const reducer = createReducer(handlers)

  it('removes any template messages', () => {
    const oldState = {
      editor: {
        uploadTemplateMessages: [
          'Template ld4P:bf2:test uploaded successfully',
        ],
      },
    }

    const action = {
      type: 'CLEAR_TEMPLATE_MESSAGES',
    }

    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      editor: {
        uploadTemplateMessages: [],
      },
    })
  })
})

describe('setTemplateMessages()', () => {
  const handlers = { SET_TEMPLATE_MESSAGES: setTemplateMessages }
  const reducer = createReducer(handlers)

  it('adds a new template message', () => {
    const payloadMsg = 'Template ld4P:bf2:test uploaded successfully'

    const oldState = {
      editor: {
        uploadTemplateMessages: [],
      },
    }

    const action = {
      type: 'SET_TEMPLATE_MESSAGES',
      payload: [payloadMsg],
    }

    const newState = reducer(oldState, action)

    expect(newState).toStrictEqual({
      editor: {
        uploadTemplateMessages: [
          payloadMsg,
        ],
      },
    })
  })
})

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
