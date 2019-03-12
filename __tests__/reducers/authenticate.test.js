import authenticate from '../../src/reducers/authenticate'

describe('changing the reducer state', () => {

  it('should handle initial state', () => {
    expect(
      authenticate(undefined, {})
    ).toEqual({loginJwt: {}})
  })

  it('handles LOG_IN', () => {
    let time = new Date()
    const expiry = time.setSeconds(time.getSeconds() + 3600)

    expect(
      authenticate({loginJwt: {}}, {
        type: 'LOG_IN',
        payload: {id_token: '1a2b3c', access_token: 'a1b2c3', expires_in: 3600, username: 'some-user', isAuthenticated: true}
      })
    ).toMatchObject(
      {loginJwt: {id_token: '1a2b3c', access_token: 'a1b2c3', username: 'some-user', isAuthenticated: true}}
    )

    const expires = authenticate({loginJwt: {}}, {
      type: 'LOG_IN',
      payload: {id_token: '1a2b3c', access_token: 'a1b2c3', expires_in: 3600, username: 'some-user', isAuthenticated: true}
    }).loginJwt['expiry']

    expect(expires).toBeGreaterThanOrEqual(expiry)
  })

  it('handles LOG_OUT', () => {
    expect(
      authenticate({loginJwt: {}}, {
        type: 'LOG_OUT'
      })
    ).toEqual(
      {loginJwt: {id_token: '', access_token: '', username: '', isAuthenticated: false, expiry: 0}}
    )
  })

})