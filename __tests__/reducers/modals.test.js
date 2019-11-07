// Copyright 2019 Stanford University see LICENSE for license

import {
  showGroupChooser, showModal, hideModal, clearModalMessages,
} from 'reducers/modals'
import { modalType, modalMessages } from 'selectors/modalSelectors'
import Validator from 'ResourceValidator'
import { createBlankState } from 'testUtils'

jest.mock('ResourceValidator')

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
    const state = createBlankState()
    state.selectorReducer.entities.resources.abc123 = {}
    state.selectorReducer.editor.modal.name = 'RDFModal'
    const result = showGroupChooser(state.selectorReducer, 'abc123')

    expect(modalType({ selectorReducer: result })).toBe('GroupChoiceModal')
  })
})

describe('showModal and hideModal for RDFModal', () => {
  it('sets the showRdfPreview to true', () => {
    const result = showModal(createBlankState().selectorReducer, { payload: 'RDFModal' })

    expect(modalType({ selectorReducer: result })).toBe('RDFModal')
  })

  it('sets the showRdfPreview to false', () => {
    const result = hideModal(createBlankState().selectorReducer)

    expect(modalType({ selectorReducer: result })).toBe(undefined)
  })
})

describe('clearModalMessages', () => {
  it('sets the showRdfPreview to true', () => {
    const state = createBlankState()
    state.selectorReducer.editor.modal.messages = ['hello']

    const result = clearModalMessages(state.selectorReducer)

    expect(modalMessages({ selectorReducer: result })).toEqual([])
  })
})
