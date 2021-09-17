// Copyright 2021 Stanford University see LICENSE for license

export const groupsReceived = (json) => ({
  type: 'GROUPS_RECEIVED',
  payload: json,
})

export const noop = () => {}
