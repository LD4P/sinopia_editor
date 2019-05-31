
export const getCurrentUser = state => getAuthenticationState(state)?.currentUser

export const getCurrentSession = state => getAuthenticationState(state)?.currentSession

export const getAuthenticationError = state => getAuthenticationState(state)?.authenticationError

export const getAuthenticationState = state => ({ ...state.authenticate.authenticationState })
