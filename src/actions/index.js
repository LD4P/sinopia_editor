// Copyright 2019 Stanford University see LICENSE for license
export const setAppVersion = (version) => ({
  type: "SET_APP_VERSION",
  payload: version,
})

export const setCurrentComponent = (rootSubjectKey, rootPropertyKey, key) => ({
  type: "SET_CURRENT_COMPONENT",
  payload: { rootSubjectKey, rootPropertyKey, key },
})
