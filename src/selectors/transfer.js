export const selectLocalId = (state, resourceKey, target, group) =>
  state.entities.localIds[resourceKey]?.[target]?.[group]

export const noop = () => {}
