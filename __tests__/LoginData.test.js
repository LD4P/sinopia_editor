import LoginData from '../src/LoginData'

const mockJWTString = require('../__mocks__/mockAWSData')
const login = new LoginData(mockJWTString)

describe('decode AWS token when logging in', () => {

  it('has access token from aws cognito', () => {
    expect(login.access_token).toEqual(mockJWTString)
  })

  it('decodes the base64 encoded string and returns the username', () => {
    expect(login.cognitoLoginData(mockJWTString)).toEqual('fake')
  })

})