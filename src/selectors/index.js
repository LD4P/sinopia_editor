export const selectCurrentComponentKey = (state, resourceKey) => state.selectorReducer.editor.currentComponent[resourceKey]?.component

export const selectCurrentPropertyKey = (state, resourceKey) => state.selectorReducer.editor.currentComponent[resourceKey]?.property

export const selectAppVersion = (state) => state.app.version

export const noop = () => {}
