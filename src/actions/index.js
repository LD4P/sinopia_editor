// Copyright 2019 Stanford University see LICENSE for license
export const setCurrentComponent = (rootSubjectKey, rootPropertyKey, key) => ({
  type: "SET_CURRENT_COMPONENT",
  payload: { rootSubjectKey, rootPropertyKey, key },
})

export const noop = () => {}
