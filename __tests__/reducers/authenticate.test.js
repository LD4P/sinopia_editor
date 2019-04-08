import authenticate from '../../src/reducers/authenticate'

describe('changing the reducer state', () => {

  it('should handle initial state', () => {
    expect(
      authenticate(undefined, {})
    ).toEqual({
      authenticationState: {
        currentUser: null,
        currentSession: null,
        authenticationError: null
      }
    })
  })

  let currentUser = { username: 'current_user@institution.edu' } // IRL, this would be a CognitoUser object
  let currentSession = { wouldBe: 'an instance of CognitoUserSession IRL' }

  it('handles AUTHENTICATION_FAILURE', () => {
    let errInfoObj = {err_code: 'SHORTER', message: 'A more descriptive human readable error message', maybe: 'someotherfields'}

    expect(
      authenticate({authenticationState: {currentUser: currentUser, currentSession: currentSession, authenticationError: null}}, {
        type: 'AUTHENTICATION_FAILURE',
        payload: {currentUser: currentUser, authenticationError: errInfoObj}
      })
    ).toEqual(
      {authenticationState: {currentUser: currentUser, currentSession: null, authenticationError: errInfoObj}}
    )
  })

  it('handles AUTHENTICATION_SUCCESS', () => {
    expect(
      authenticate({}, {
        type: 'AUTHENTICATION_SUCCESS',
        payload: {currentUser: currentUser, currentSession: currentSession}
      })
    ).toMatchObject(
      {authenticationState: {currentUser: currentUser, currentSession: currentSession}}
    )
  })

  it('handles SIGN_OUT_SUCCESS', () => {
    expect(
      authenticate({authenticationState: {currentUser: currentUser, currentSession: currentSession}}, {
        type: 'SIGN_OUT_SUCCESS'
      })
    ).toEqual(
      {authenticationState: {currentUser: null, currentSession: null, authenticationError: null}}
    )
  })

})