export const setRelationships = (state, action) => ({
  ...state,
  relationships: {
    ...state.relationships,
    [action.payload.resourceKey]: action.payload.relationships,
  },
})

export const clearRelationships = (state, action) => {
  const newRelationships = { ...state.relationships }
  delete newRelationships[action.payload]

  return {
    ...state,
    relationships: newRelationships,
  }
}

export const setSearchRelationships = (state, action) => {
  if (!state.resource) return state

  return {
    ...state,
    resource: {
      ...state.resource,
      relationshipResults: {
        ...state.resource.relationshipResults,
        [action.payload.uri]: action.payload.relationships,
      },
    },
  }
}
