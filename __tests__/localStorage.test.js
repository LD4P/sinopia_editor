import { loadState, saveState, clearState } from '../src/localStorage'

const stored = {loginJwt: {id_token: '1a2b3c', access_token: 'a1b2c3', username: 'some-user', isAuthenticated: true, expiry: 12345}}

describe('managing state with localStorage', () => {

  it('saves the state to localStorage', () => {
    saveState(stored)
  })

  it('retrieves the state from localStorage', () => {
    const state = loadState('jwtAuth')
    expect(state).toMatchObject(stored)
  })

  it('clears out the state', () => {
    clearState()
    const state = loadState('jwtAuth')
    expect(state).toBeUndefined()
  })
})
