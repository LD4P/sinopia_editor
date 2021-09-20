// Copyright 2021 Stanford University see LICENSE for license

export const hasGroups = (state) => {
  state.entities.groups.length > 0
}

export const selectAllGroups = (state) => state.entities.groups

export const noop = () => {}
