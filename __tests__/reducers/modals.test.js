// Copyright 2019 Stanford University see LICENSE for license

import {
  showGroupChooser, showModal, hideModal, clearModalMessages,
} from 'reducers/modals'
import { modalType, modalMessages } from 'selectors/modalSelectors'
import Validator from 'ResourceValidator'

jest.mock('ResourceValidator')

let initialState
beforeEach(() => {
  initialState = {
    editor: {
      resourceValidation: {
        show: false,
        errors: [],
        errorsByPath: {},
      },
      modal: {
        name: undefined,
      },
    },
    resource: { },
    entities: { },
  }
})

describe('showGroupChooser()', () => {
  beforeAll(() => {
    Validator.mockImplementation(() => {
      return {
        validate: () => {
          return [{}, []]
        },
      }
    })
  })
  it('sets the modal name to GroupChoiceModal', () => {
    initialState.editor.modal.name = 'RDFModal'
    const result = showGroupChooser(initialState)

    expect(modalType({ selectorReducer: result })).toBe('GroupChoiceModal')
  })
})

describe('showModal and hideModal for RDFModal', () => {
  it('sets the showRdfPreview to true', () => {
    const result = showModal(initialState, { payload: 'RDFModal' })

    expect(modalType({ selectorReducer: result })).toBe('RDFModal')
  })

  it('sets the showRdfPreview to false', () => {
    const result = hideModal(initialState)

    expect(modalType({ selectorReducer: result })).toBe(undefined)
  })
})

describe('clearModalMessages', () => {
  it('sets the showRdfPreview to true', () => {
    initialState.editor.modal.messages = ['hello']

    const result = clearModalMessages(initialState)

    expect(modalMessages({ selectorReducer: result })).toEqual([])
  })
})
