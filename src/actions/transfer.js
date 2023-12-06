export const clearLocalIds = (resourceKey) => ({
  type: "CLEAR_LOCAL_IDS",
  payload: resourceKey,
})

export const setLocalId = (resourceKey, target, group, localId) => ({
  type: "SET_LOCAL_ID",
  payload: { resourceKey, target, group, localId },
})
