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
