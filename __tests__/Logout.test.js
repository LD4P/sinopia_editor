import Config from '../src/Config'
import Logout from '../src/Logout'

const logout = new Logout()
describe('Logging out', () => {
  it('has a redirect url to aws cognito', () => {
    expect(logout.url).toEqual(Config.awsCognitoLogoutUrl)
  })
})
