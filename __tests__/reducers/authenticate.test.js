// Copyright 2018 Stanford University see LICENSE for license

import authenticate from '../../src/reducers/authenticate'

describe('changing the reducer state', () => {
  it('should handle initial state', () => {
    expect(
      authenticate(undefined, {}),
    ).toEqual({
      authenticationState: {
        currentUser: null,
        currentSession: null,
        authenticationError: null,
      },
    })
  })

  const currentUser = { username: 'current_user@institution.edu' } // IRL, this would be a CognitoUser object
  const currentSession = { wouldBe: 'an instance of CognitoUserSession IRL' }

  it('handles AUTHENTICATION_FAILURE', () => {
    const errInfoObj = { err_code: 'SHORTER', message: 'A more descriptive human readable error message', maybe: 'someotherfields' }

    expect(
      authenticate({ authenticationState: { currentUser, currentSession, authenticationError: null } }, {
        type: 'AUTHENTICATION_FAILURE',
        payload: { currentUser, authenticationError: errInfoObj },
      }),
    ).toEqual(
      { authenticationState: { currentUser, currentSession: null, authenticationError: errInfoObj } },
    )
  })

  it('handles AUTHENTICATION_SUCCESS', () => {
    expect(
      authenticate({}, {
        type: 'AUTHENTICATION_SUCCESS',
        payload: { currentUser, currentSession },
      }),
    ).toMatchObject(
      { authenticationState: { currentUser, currentSession } },
    )
  })

  it('handles SIGN_OUT_SUCCESS', () => {
    expect(
      authenticate({ authenticationState: { currentUser, currentSession } }, {
        type: 'SIGN_OUT_SUCCESS',
      }),
    ).toEqual(
      { authenticationState: { currentUser: null, currentSession: null, authenticationError: null } },
    )
  })
})
