import authenticate from '../../src/reducers/authenticate'

describe('changing the reducer state', () => {

  it('should handle initial state', () => {
    expect(
      authenticate(undefined, {})
    ).toEqual({loginJwt: {}})
  })

  it('handles LOG_IN', () => {
    expect(
      authenticate({loginJwt: {}}, {
        type: 'LOG_IN',
        payload: {id_token: '1a2b3c', access_token: 'a1b2c3', expires_in: 3600, username: 'some-user', isAuthenticated: true}
      })
    ).toEqual(
      {loginJwt: {id_token: '1a2b3c', access_token: 'a1b2c3', username: 'some-user', isAuthenticated: true}}
    )
  })

  it('handles LOG_OUT', () => {
    expect(
      authenticate({loginJwt: {}}, {
        type: 'LOG_OUT'
      })
    ).toEqual(
      {loginJwt: {id_token: '', access_token: '', username: '', isAuthenticated: false}}
    )
  })

})