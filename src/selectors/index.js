export const selectCurrentComponentKey = (state, resourceKey) =>
  state.editor.currentComponent[resourceKey]?.component

export const selectCurrentPropertyKey = (state, resourceKey) =>
  state.editor.currentComponent[resourceKey]?.property

export const isCurrentComponent = (state, resourceKey, componentKey) =>
  state.editor.currentComponent[resourceKey]?.component === componentKey

export const isCurrentProperty = (state, resourceKey, propertyKey) =>
  state.editor.currentComponent[resourceKey]?.property === propertyKey

export const noop = () => {}
