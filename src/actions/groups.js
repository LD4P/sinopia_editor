// Copyright 2021 Stanford University see LICENSE for license

export const groupsReceived = (groups) => ({
  type: "GROUPS_RECEIVED",
  payload: groups,
})

export const noop = () => {}
