import { validate } from 'reducers/inputs'

export const clearModalMessages = (state) => {
  const newState = { ...state }

  newState.editor.modal.messages = []
  return newState
}

export const addModalMessage = (state, action) => {
  const newState = { ...state }

  newState.editor.modal.messages = [...newState.editor.modal.messages, action.message]
  return newState
}

export const showModal = (state, action) => setModal({ ...state }, action.payload)

export const hideModal = state => setModal({ ...state }, undefined)


/**
 * Open the group choice dialog and closes RDF modal
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const showGroupChooser = (state) => {
  if (validate(state).editor.resourceValidation.errors.length === 0) {
    // Show the window to select a group
    return setModal({ ...state }, 'GroupChoiceModal')
  }

  return showValidationErrors(state)
}

/**
 * Close modals and show validation errors
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const showValidationErrors = (state) => {
  const newState = hideModal(state)
  newState.editor.resourceValidation.show = true

  return newState
}

const setModal = (newState, name) => {
  newState.editor.modal.name = name
  return newState
}
