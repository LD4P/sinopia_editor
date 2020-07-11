// Copyright 2019 Stanford University see LICENSE for license

import {
  showGroupChooser, showModal, hideModal, clearModalMessages,
} from 'reducers/modals'
import { selectModalType, selectModalMessages } from 'selectors/modals'
import { createState } from 'stateUtils'

describe('showGroupChooser()', () => {
  it('sets the modal name to GroupChoiceModal', () => {
    const state = createState()
    state.selectorReducer.editor.modal.name = 'RDFModal'
    const result = showGroupChooser(state.selectorReducer, 'abc123')

    expect(selectModalType({ selectorReducer: result })).toBe('GroupChoiceModal')
  })
})

describe('showModal and hideModal for RDFModal', () => {
  it('sets the showRdfPreview to true', () => {
    const result = showModal(createState().selectorReducer, { payload: 'RDFModal' })

    expect(selectModalType({ selectorReducer: result })).toBe('RDFModal')
  })

  it('sets the showRdfPreview to false', () => {
    const result = hideModal(createState().selectorReducer)

    expect(selectModalType({ selectorReducer: result })).toBe(undefined)
  })
})

describe('clearModalMessages', () => {
  it('sets the showRdfPreview to true', () => {
    const state = createState()
    state.selectorReducer.editor.modal.messages = ['hello']

    const result = clearModalMessages(state.selectorReducer)

    expect(selectModalMessages({ selectorReducer: result })).toEqual([])
  })
})
