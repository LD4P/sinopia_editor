// Copyright 2021 Stanford University see LICENSE for license

export const hasGroups = (state) => {
  Object.keys(state.entities.groupMap).length > 0
}

export const selectGroupMap = (state) => state.entities.groupMap

export const noop = () => {}
