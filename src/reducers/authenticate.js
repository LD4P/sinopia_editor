// Copyright 2018 Stanford University see LICENSE for license

export const setUser = (state, action) => {
  const newState = { ...state }
  newState.user = { ...action.payload }
  return newState
}

export const removeUser = (state) => {
  const newState = { ...state }
  delete newState.user
  return newState
}
