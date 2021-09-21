// Copyright 2019 Stanford University see LICENSE for license
export const exportsReceived = (keys) => ({
  type: "EXPORTS_RECEIVED",
  payload: keys,
})

export const noop = () => {}
