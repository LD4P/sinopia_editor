export const hasUser = (state) => !!state.authenticate.user

export const selectUser = (state) => state.authenticate.user

export const selectGroups = (state) => state.authenticate.user?.groups
