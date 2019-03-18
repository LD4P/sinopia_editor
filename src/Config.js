class Config {
  static get sinopiaDomainName() {
    return process.env.SINOPIA_URI || 'sinopia.io'
  }

  static get sinopiaUrl() {
    return `https://${this.sinopiaDomainName}`
  }

  static get sinopiaServerUrl() {
    return process.env.REACT_APP_SINOPIA_SERVER_URL || 'http://localhost:8080'
  }

  static get resourceTemplateContainerPath() {
    return 'ld4p'
  }

  static get resourceTemplateContainerUrl() {
    return `${this.sinopiaServerUrl}/${this.resourceTemplateContainerPath}`
  }

  static get spoofSinopiaServer() {
    // There are two value types of `process.env` variables:
    //   1. When undefined, `if` condition it not satisfied and default `true` is returned
    //   2. When defined, will always be a string.
    //     a. When set to 'true' return `true` (use spoof)
    //     b. When set to 'false' or any other string, return `false` (don't use spoof)
    if (process.env.REACT_APP_SPOOF_SINOPIA_SERVER)
      return process.env.REACT_APP_SPOOF_SINOPIA_SERVER === 'true'
    return true
  }

  static get awsClientID() {
    return process.env.COGNITO_CLIENT_ID || '2u6s7pqkc1grq1qs464fsi82at'
  }

  static get awsCognitoDomain() {
    return process.env.AWS_COGNITO_DOMAIN || 'sinopia-development.auth.us-west-2.amazoncognito.com'
  }

  static get awsCognitoLoginUrl() {
    return `https://${this.awsCognitoDomain}/login?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoLogoutUrl() {
    return `https://${this.awsCognitoDomain}/logout?response_type=token&client_id=${this.awsClientID}&logout_uri=${this.sinopiaUrl}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoForgotPasswordUrl() {
    return `https://${this.awsCognitoDomain}/forgotPassword?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoResetPasswordUrl() {
    return `https://${this.awsCognitoDomain}/signup?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoJWTHashForTest() {
    return '#id_token=eyJraWQiOiJZa1ZFamRXUldveVU3alZlWVlvSzNmRzJpOFhDbTRUbFFFUEpsNFBRWEZJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiWjNvUlVua09FU3Jpd05LNHBpR19OdyIsInN1YiI6IjNiOTQ0ODQxLTY2NzEtNDIzYi04NjIyLWVmNTVhMjhlMWRlMyIsImF1ZCI6IjU0M2Nhdjk1dTBxMXJxY2FnczFuZWRjNjhhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNWE1MTc5YjUtNDUwNi0xMWU5LWI2MzQtYjdlNjk0NzdhNDhkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTI0MjI5MjAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0hVbU5JZG1oeSIsImNvZ25pdG86dXNlcm5hbWUiOiJjaS1lZGl0b3ItdXNlciIsImV4cCI6MTU1MjQyNjUyMCwiaWF0IjoxNTUyNDIyOTIwLCJlbWFpbCI6ImpncmViZW5Ac3RhbmZvcmQuZWR1In0.etfYjc2CSeWOFey9npSpV_dgSQw6ufjaQmEf2lOZ4bzwTYPQ6IFLoetUKPaPQ5jUQWbZwkXA-SV5BsM-t0GRHO6z3VJNLZxwExP1nAJKV-mneWieqBJCr6YBlD-wD-Dn-G3v5uEtx5Ha-ZexfY4YDBMSuUd9uiJhwjiuxAIrp66ZahiW0MuaUNdStRd1X2JGJ2q4TQTLDvVQ0lnuMk6yfD5RDG2oujldJuSMWOJXuMK9DCA-H_xerWYDLEdfa0H8xKOpIsRcx6aIKfOsuv9v57bWonAe11La3UZGyaGf2QyXzMhdEyJSfKynauCfauOtWkvyYx7BuiP8r0v5sFY5EQ&access_token=eyJraWQiOiJBaHRJUGtMcUdaR0pFUTkyNmNQckJVdXdqQTZXVTZDNVB2TWJVb0pKQUNvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzYjk0NDg0MS02NjcxLTQyM2ItODYyMi1lZjU1YTI4ZTFkZTMiLCJldmVudF9pZCI6IjVhNTE3OWI1LTQ1MDYtMTFlOS1iNjM0LWI3ZTY5NDc3YTQ4ZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIGVtYWlsIiwiYXV0aF90aW1lIjoxNTUyNDIyOTIwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9IVW1OSWRtaHkiLCJleHAiOjE1NTI0MjY1MjAsImlhdCI6MTU1MjQyMjkyMCwidmVyc2lvbiI6MiwianRpIjoiYmE2OWRmMjctOTMzYi00YmM2LTkwYzMtMTJhOWQyNjMxODljIiwiY2xpZW50X2lkIjoiNTQzY2F2OTV1MHExcnFjYWdzMW5lZGM2OGEiLCJ1c2VybmFtZSI6ImNpLWVkaXRvci11c2VyIn0.DGcawIURydWlaENsKHLFaENdrX8706so4b0ISFvy1_KeIBGA6y4lDPQVktXQpQTsZRpgTBOs6N3i7lZjE2SquKTzwkOQ0LyRmwxOwJ2YByNqrQO4-vhs7PHGi6rd_HLBphasjGXfWL_kyzyguWVv2o800AJleK5WXeIkKCFSb0ECyTa6FfsbtIqc-Bc71RroB1gxUg71hDt9XnG8mlkWMYPPFKt06WNQZPnUFwn2A1vP7zOCHYpVN850k7--MWvDWDMCWbTDcq_auj3DdvDEIRZ8-vulCd_VWig89TekEGhcZ4ra8JBN02U1LdB5ZyGIBIPdDvrufge52kqn7uW6Cg&expires_in=3600&token_type=Bearer'
  }
}

export default Config
