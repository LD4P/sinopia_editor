// Copyright 2019 Stanford University see LICENSE for license

export const exportsReceived = (state, action) => {
  const newState = { ...state }
  newState.entities.exports = [...action.payload]
  return newState
}

export const noop = () => {}
