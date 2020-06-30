import { selectValidationErrors } from 'selectors/errors'
import { showValidationErrors } from './errors'
import _ from 'lodash'

export const clearModalMessages = (state) => {
  const newState = { ...state }

  newState.editor.modal.messages = []
  return newState
}

export const addModalMessage = (state, action) => {
  const newState = { ...state }
  newState.editor.modal.messages = [...newState.editor.modal.messages, action.payload]
  return newState
}

export const showModal = (state, action) => setModal({ ...state }, action.payload)

export const hideModal = (state) => setModal({ ...state }, undefined)


/**
 * Open the group choice dialog and closes RDF modal
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const showGroupChooser = (state, action) => {
  const resourceKey = action.payload
  if (_.isEmpty(selectValidationErrors({ selectorReducer: state }, resourceKey))) {
    // Show the window to select a group
    return setModal({ ...state }, 'GroupChoiceModal')
  }

  return showValidationErrors(state, action)
}

const setModal = (newState, name) => {
  newState.editor.modal.name = name
  return newState
}
