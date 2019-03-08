class LoginData {
  constructor(access_token) {
    this.access_token = access_token
  }

  //TODO: if we need to strongly verify the JWT claims we can also implement this:
  // https://aws.amazon.com/premiumsupport/knowledge-center/decode-verify-cognito-json-token/
  cognitoLoginData(access_token) {
    let userName = ''
    if(access_token !== undefined) {
      const data = access_token.split('.')[1]
      const cognitoPayload = JSON.parse((Buffer.from(data, 'base64')).toString('utf8'))
      userName = cognitoPayload.username
    }
    return userName
  }
}

export default LoginData
