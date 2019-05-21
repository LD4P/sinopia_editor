const DEFAULT_STATE = {
  authenticationState: {
    currentUser: null,
    currentSession: null,
    authenticationError: null
  }
}

const authenticationFailure = (state, action) => {
  return {
    authenticationState: {
      currentUser: action.payload.currentUser,
      currentSession: null,
      authenticationError: action.payload.authenticationError
    }
  }
}

const authenticationSuccess = (state, action) => {
  return {
    authenticationState: {
      currentUser: action.payload.currentUser,
      currentSession: action.payload.currentSession,
      authenticationError: null
    }
  }
}

const signOutSuccess = () => {
  return Object.assign({}, DEFAULT_STATE)
}

const authenticate = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'AUTHENTICATION_FAILURE':
      return authenticationFailure(state, action)
    case 'AUTHENTICATION_SUCCESS':
      return authenticationSuccess(state, action)
    case 'SIGN_OUT_SUCCESS':
      return signOutSuccess()
    default:
      return state
  }
}

export default authenticate
