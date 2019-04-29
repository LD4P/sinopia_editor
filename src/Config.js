class Config {

  static get defaultSinopiaGroupId() {
    return process.env.SINOPIA_GROUP || 'ld4p'
  }

  static get defaultProfileSchemaVersion() {
    return process.env.DEFAULT_PROFILE_SCHEMA_VERSION || '0.0.2'
  }

  static get sinopiaDomainName() {
    return process.env.SINOPIA_URI || 'sinopia.io'
  }

  static get sinopiaServerBase() {
    return process.env.TRELLIS_BASE_URL || 'http://localhost:8080'
  }

  static get awsCognitoDomain() {
    return process.env.AWS_COGNITO_DOMAIN || 'sinopia-development.auth.us-west-2.amazoncognito.com'
  }

  static get spoofSinopiaServer() {
    // There are two value types of `process.env` variables:
    //   1. When undefined, `if` condition is not satisfied and default `false` is returned
    //   2. When defined, will always be a string.
    //     a. When set to 'true' return `true` (use spoof)
    //     b. When set to 'false' or any other string, return `false` (don't use spoof)
    if (process.env.SPOOF_SINOPIA_SERVER)
      return process.env.SPOOF_SINOPIA_SERVER === 'true'
    return false
  }

  static get awsClientID() {
    return process.env.COGNITO_CLIENT_ID || '2u6s7pqkc1grq1qs464fsi82at'
  }

  static get sinopiaUrl() {
    return `https://${this.sinopiaDomainName}`
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
    return '#id_token=eyJraWQiOiI1OFRSSmJ3bFc4RlJJTmFiZllxak11d0V2empcLzBiMjBtTXBNejF2S1FUaz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiUEJDLTdsazlITWtwYkpjdjlXYlluZyIsInN1YiI6Ijc4OWRkYTdkLTI1YzAtNGE4Zi05YzYyLWIzMTE2YTk3Y2M5YiIsImF1ZCI6IjJ1NnM3cHFrYzFncnExcXM0NjRmc2k4MmF0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNjNjMjJhYmYtNWZkNi0xMWU5LWEwN2ItZTlmZTA3NzQxN2ZkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTUzNzEwMDEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0NHZDlXcTEzNiIsImNvZ25pdG86dXNlcm5hbWUiOiJzaW5vcGlhLWRldnNfY2xpZW50LXRlc3RlciIsImV4cCI6MTU1NTM3NDYwMSwiaWF0IjoxNTU1MzcxMDAxLCJlbWFpbCI6InNpbm9waWEtZGV2cytjbGllbnQtdGVzdGVyQGxpc3RzLnN0YW5mb3JkLmVkdSJ9.JMf4p2teIsL3DDFgHsaqdAEd_kf0WytEsi00TsfhAIzVUglAvAYg5OZkFToE1vEjzvZH9HXhNSj6PT2DpO5HPhuWLvbGyw7dX_MfZpxO7wlIBhgy2FhRLkcytgEzyfMQEtDvRMD0-HUVpGBjwV4bteILl0cwi_MZ8y0U81Etn7QTDSUPE1bilGOBFKveLw8lzgiNJcJkRZbRc2FVoPvfVqSoq8iH2FXuw1HoY7lBWIBVAeq8ETBxBRHJc7xoN7S8YcARXnsyFJrmdAgHFs-rt5639ts1eNlXnen6sBIlVhOwaekBZgX0twEg8vZvsNK0L3GRjyVDNPB6f281DDfQtg&access_token=eyJraWQiOiJyVDUwbnpEREVGOFJMWHJacTAzb0E2WW82NVBHdjFaQ3ZRWlBsdEE0Sm1vPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ODlkZGE3ZC0yNWMwLTRhOGYtOWM2Mi1iMzExNmE5N2NjOWIiLCJldmVudF9pZCI6IjYzYzIyYWJmLTVmZDYtMTFlOS1hMDdiLWU5ZmUwNzc0MTdmZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIGVtYWlsIiwiYXV0aF90aW1lIjoxNTU1MzcxMDAxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9DR2Q5V3ExMzYiLCJleHAiOjE1NTUzNzQ2MDEsImlhdCI6MTU1NTM3MTAwMSwidmVyc2lvbiI6MiwianRpIjoiZWI4NWQ3MTAtN2ZiYS00MTM0LWFkYzEtODlmN2EzYjYxY2NlIiwiY2xpZW50X2lkIjoiMnU2czdwcWtjMWdycTFxczQ2NGZzaTgyYXQiLCJ1c2VybmFtZSI6InNpbm9waWEtZGV2c19jbGllbnQtdGVzdGVyIn0.ld4S9yV1ABBDJ3PbL_ag6eMKWb6N4YHrBciXce-e7Ch_9h2eTocKwZrofwfV-0D8QeRBZwyB0FJCuSk49GK_8WoGKmCpFHg0lkuTtNJasT121KDxc2ey4SZd9khae8SetLX7JEziLsGsqZQzDdR0yjolGycBfqPZH7HxS6zvfYyUimbv38vcgPebInFZ4Dmh5kBD7eldwdIPTgPEbfMSWZ2rL1FTY2mq9GZhBDJ6Iz7yAlKA5GnBtnpUsdGmKLmUMFS_ALLt3jg9ZLUIfX6MU1aWsa9oivhxvTn-fAfHI6m7UZu_B2IMXZIu8Wwe_E5FuQCP1057TamsvWf8omajhA&expires_in=3600&token_type=Bearer'
  }

  static get awsCognitoIdToken() {
    return 'eyJraWQiOiI1OFRSSmJ3bFc4RlJJTmFiZllxak11d0V2empcLzBiMjBtTXBNejF2S1FUaz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiUEJDLTdsazlITWtwYkpjdjlXYlluZyIsInN1YiI6Ijc4OWRkYTdkLTI1YzAtNGE4Zi05YzYyLWIzMTE2YTk3Y2M5YiIsImF1ZCI6IjJ1NnM3cHFrYzFncnExcXM0NjRmc2k4MmF0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNjNjMjJhYmYtNWZkNi0xMWU5LWEwN2ItZTlmZTA3NzQxN2ZkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTUzNzEwMDEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0NHZDlXcTEzNiIsImNvZ25pdG86dXNlcm5hbWUiOiJzaW5vcGlhLWRldnNfY2xpZW50LXRlc3RlciIsImV4cCI6MTU1NTM3NDYwMSwiaWF0IjoxNTU1MzcxMDAxLCJlbWFpbCI6InNpbm9waWEtZGV2cytjbGllbnQtdGVzdGVyQGxpc3RzLnN0YW5mb3JkLmVkdSJ9.JMf4p2teIsL3DDFgHsaqdAEd_kf0WytEsi00TsfhAIzVUglAvAYg5OZkFToE1vEjzvZH9HXhNSj6PT2DpO5HPhuWLvbGyw7dX_MfZpxO7wlIBhgy2FhRLkcytgEzyfMQEtDvRMD0-HUVpGBjwV4bteILl0cwi_MZ8y0U81Etn7QTDSUPE1bilGOBFKveLw8lzgiNJcJkRZbRc2FVoPvfVqSoq8iH2FXuw1HoY7lBWIBVAeq8ETBxBRHJc7xoN7S8YcARXnsyFJrmdAgHFs-rt5639ts1eNlXnen6sBIlVhOwaekBZgX0twEg8vZvsNK0L3GRjyVDNPB6f281DDfQtg.QGFiYyQxMjM'
  }

  static get awsCognitoAccessToken() {
    return 'eyJraWTigJ064oCdQUJDMTIzPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNo4oCdOuKAnWExYjJjM+KAnSzigJ1zdWLigJ064oCdYTEtYjItYzMtZDQtZTXigJ0s4oCdYXVk4oCdOuKAnWExYjJjM2Q0ZTXigJ0s4oCdZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lk4oCdOuKAnWExLWIyLWMzLWQ04oCdLOKAnXRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1l4oCdOjU1NTU1NTU1NTUs4oCdaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfQ0dkOVdxMTM2IiwiY29nbml0bzp1c2VybmFtZSI6InNpbm9waWEtZGV2c19jbGllbnQtdGVzdGVyIiwiZXhw4oCdOjU1NTU1NTU1NTUs4oCdaWF04oCdOjU1NTU1NTU1NTUs4oCdZW1haWwiOiJzaW5vcGlhLWRldnMrY2xpZW50LXRlc3RlckBsaXN0cy5zdGFuZm9yZC5lZHUifQ.QGFiYyQxMjM'
  }
}

export default Config
