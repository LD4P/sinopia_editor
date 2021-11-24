export const setRelationships = (resourceKey, relationships) => ({
  type: "SET_RELATIONSHIPS",
  payload: {
    resourceKey,
    relationships,
  },
})

export const clearRelationships = (resourceKey) => ({
  type: "CLEAR_RELATIONSHIPS",
  payload: resourceKey,
})

export const setSearchRelationships = (uri, relationships) => ({
  type: "SET_SEARCH_RELATIONSHIPS",
  payload: {
    uri,
    relationships,
  },
})
