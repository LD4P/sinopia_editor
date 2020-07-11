
export const selectCurrentUser = (state) => getAuthenticationState(state)?.currentUser

export const selectCurrentSession = (state) => getAuthenticationState(state)?.currentSession

export const selectAuthenticationError = (state) => getAuthenticationState(state)?.authenticationError

const getAuthenticationState = (state) => ({ ...state.authenticate.authenticationState })
