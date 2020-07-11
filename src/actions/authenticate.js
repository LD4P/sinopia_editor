export const authenticationFailure = (authenticationResult) => ({
  type: 'AUTHENTICATION_FAILURE',
  payload: authenticationResult,
})

export const authenticationSuccess = (authenticationResult) => ({
  type: 'AUTHENTICATION_SUCCESS',
  payload: authenticationResult,
})

export const signOutSuccess = () => ({
  type: 'SIGN_OUT_SUCCESS',
})
