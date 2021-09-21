export const addError = (errorKey, error) => ({
  type: "ADD_ERROR",
  payload: { errorKey, error },
})

export const clearErrors = (errorKey) => ({
  type: "CLEAR_ERRORS",
  payload: errorKey,
})

export const hideValidationErrors = (resourceKey) => ({
  type: "HIDE_VALIDATION_ERRORS",
  payload: resourceKey,
})

export const showValidationErrors = (resourceKey) => ({
  type: "SHOW_VALIDATION_ERRORS",
  payload: resourceKey,
})
