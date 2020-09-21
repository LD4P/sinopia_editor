// Copyright 2020 Stanford University see LICENSE for license

import {
  setLiteralInputContent, hideDiacriticsSelection, showDiacriticsSelection,
} from 'reducers/inputs'
import { createReducer } from 'reducers/index'

const handlers = {
  SET_LITERAL_CONTENT: setLiteralInputContent,
}

const reducer = createReducer(handlers)

const editorHandlers = {
  HIDE_DIACRITICS: hideDiacriticsSelection,
  SHOW_DIACRITICS: showDiacriticsSelection,
}

const editorReducer = createReducer(editorHandlers)


describe('setLiteralInputContent()', () => {
  it('sets a literal value', () => {
    const oldState = {
      editor: {
        content: {},
      },
    }

    const action = {
      type: 'SET_LITERAL_CONTENT',
      payload: {
        key: '345adfe',
        literal: 'A good thing',
      },
    }

    const newState = reducer(oldState, action)
    expect(newState.editor.content).toStrictEqual({
      '345adfe': 'A good thing',
    })
  })
})

describe('hideDiacriticsSelection()', () => {
  it('hides the diacritic component', () => {
    const oldState = {
      diacritics: {
        show: true,
        key: '3456abc',
      },
    }

    const action = {
      type: 'HIDE_DIACRITICS',
    }

    const newState = editorReducer(oldState, action)
    expect(newState.diacritics.show).toBeFalsy()
    expect(newState.diacritics.key).toBe(null)
  })
})

describe('showDiacriticsSelection()', () => {
  it('shows diacritic component', () => {
    const oldState = {
      diacritics: {
        show: false,
        key: null,
      },
    }

    const action = {
      type: 'SHOW_DIACRITICS',
      payload: 'efq3450',
    }

    const newState = editorReducer(oldState, action)
    expect(newState.diacritics).toStrictEqual({
      show: true,
      key: 'efq3450',
    })
  })
})
