// Copyright 2019 Stanford University see LICENSE for license

import {
  addError, clearErrors, hideValidationErrors, showValidationErrors,
} from 'reducers/errors'

import { createReducer } from 'reducers/index'

const handlers = {
  ADD_ERROR: addError,
  CLEAR_ERRORS: clearErrors,
  HIDE_VALIDATION_ERRORS: hideValidationErrors,
  SHOW_VALIDATION_ERRORS: showValidationErrors,
}

const reducer = createReducer(handlers)

describe('addError()', () => {
  it('adds new error without existing errors', () => {
    const oldState = {
      editor: {
        errors: {},
      },
    }

    const action = {
      type: 'ADD_ERROR',
      payload: {
        errorKey: 'rty6789',
        error: 'Failed to add a resource',
      },
    }

    const newState = reducer(oldState, action)
    expect(newState.editor.errors).toStrictEqual({
      rty6789: ['Failed to add a resource'],
    })
  })

  it('adds error to existing errors', () => {
    const oldState = {
      editor: {
        errors: {
          er345v2: ['Existing validation error'],
        },
      },
    }

    const action = {
      type: 'ADD_ERROR',
      payload: {
        errorKey: 'er345v2',
        error: 'Second validation error',
      },
    }

    const newState = reducer(oldState, action)
    expect(newState.editor.errors.er345v2).toStrictEqual([
      'Existing validation error',
      'Second validation error',
    ])
  })
})

describe('clearErrors()', () => {
  it('sets errors to empty for a given errorKey', () => {
    const oldState = {
      editor: {
        errors: {
          gh345690: [
            'a short error',
            'a longer error message',
          ],
        },
      },
    }

    const action = {
      type: 'CLEAR_ERRORS',
      payload: 'gh345690',
    }

    const newState = reducer(oldState, action)

    expect(newState.editor.errors.gh345690).toStrictEqual([])
  })
})

describe('hideValidationErrors()', () => {
  it('sets show validation error for a key to false', () => {
    const oldState = {
      editor: {
        resourceValidation: {
          show: {
            u230f67: true,
          },
        },
      },
    }

    const action = {
      type: 'HIDE_VALIDATION_ERRORS',
      payload: 'u230f67',
    }

    const newState = reducer(oldState, action)

    expect(newState.editor.resourceValidation.show.u230f67).toBeFalsy()
  })
})

describe('showValidationErrors()', () => {
  it('shows validation errors for a resource', () => {
    const oldState = {
      editor: {
        modal: {
          name: 'An error modal',
        },
        resourceValidation: {
          show: {
            fgen0234: false,
          },
        },
      },
    }

    const action = {
      type: 'SHOW_VALIDATION_ERRORS',
      payload: 'fgen0234',
    }

    const newState = reducer(oldState, action)

    expect(newState.editor.modal.name).toBe(undefined)
    expect(newState.editor.resourceValidation.show.fgen0234).toBeTruthy()
  })
})
