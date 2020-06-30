import { hideModal } from './modals'

/**
 * Hide validation errors
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const hideValidationErrors = (state, action) => {
  const newState = { ...state }
  const resourceKey = action.payload
  newState.editor.resourceValidation.show[resourceKey] = false

  return newState
}

export const addError = (state, action) => {
  const newState = { ...state }

  const existingErrors = newState.editor.errors[action.payload.errorKey]
  if (existingErrors) {
    newState.editor.errors[action.payload.errorKey] = [...existingErrors, action.payload.error]
  } else {
    newState.editor.errors[action.payload.errorKey] = [action.payload.error]
  }

  return newState
}

export const clearErrors = (state, action) => {
  const newState = { ...state }

  newState.editor.errors[action.payload] = []

  return newState
}

/**
 * Close modals and show validation errors
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const showValidationErrors = (state, action) => {
  const newState = hideModal(state)
  const resourceKey = action.payload
  newState.editor.resourceValidation.show[resourceKey] = true

  return newState
}
