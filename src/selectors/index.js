export const selectCurrentComponentKey = (state, resourceKey) => state.editor.currentComponent[resourceKey]?.component

export const selectCurrentPropertyKey = (state, resourceKey) => state.editor.currentComponent[resourceKey]?.property

export const selectAppVersion = (state) => state.app.version

export const noop = () => {}
