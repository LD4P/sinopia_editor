// Copyright 2020 Stanford University see LICENSE for license

export const addError = (state, action) => ({
  ...state,
  errors: {
    ...state.errors,
    [action.payload.errorKey]: [
      ...(state.errors[action.payload.errorKey] || []),
      action.payload.error,
    ],
  },
})

export const clearLocalIds = (state, action) => {
  const newLocalIds = { ...state.localIds }
  delete newLocalIds[action.payload]

  return {
    ...state,
    localIds: newLocalIds,
  }
}

export const setLocalId = (state, action) => ({
  ...state,
  localIds: {
    ...state.localIds,
    [action.payload.resourceKey]: {
      ...state.localIds[action.payload.resourceKey],
      [action.payload.target]: {
        ...state.localIds[action.payload.resourceKey]?.[action.payload.target],
        [action.payload.group]: action.payload.localId,
      },
    },
  },
})
