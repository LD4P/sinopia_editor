// Copyright 2019 Stanford University see LICENSE for license

export const exportsReceived = (state, action) => ({
  ...state,
  exports: action.payload,
})

export const noop = () => {}
