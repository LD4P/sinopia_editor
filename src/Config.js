class Config {

  static get defaultSinopiaGroupId() {
    return process.env.SINOPIA_GROUP || 'ld4p'
  }

  static get defaultProfileSchemaVersion() {
    return process.env.DEFAULT_PROFILE_SCHEMA_VERSION || '0.0.2'
  }

  static get sinopiaServerBase() {
    return process.env.TRELLIS_BASE_URL || 'http://localhost:8080'
  }

  static get awsCognitoDomain() {
    return process.env.AWS_COGNITO_DOMAIN || 'https://sinopia-development.auth.us-west-2.amazoncognito.com'
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
    return process.env.SINOPIA_URI || 'https://sinopia.io'
  }

  static get sinopiaDomainName() {
    return `${this.sinopiaUrl}`.replace('https://', '')
  }

  static get sinopiaHelpAndResourcesMenuContent() {
    return 'https://ld4p.github.io/sinopia/help_and_resources/menu_content.html'
  }

  static get awsCognitoLoginUrl() {
    return `${this.awsCognitoDomain}/login?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoLogoutUrl() {
    return `${this.awsCognitoDomain}/logout?response_type=token&client_id=${this.awsClientID}&logout_uri=${this.sinopiaUrl}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoForgotPasswordUrl() {
    return `${this.awsCognitoDomain}/forgotPassword?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoResetPasswordUrl() {
    return `${this.awsCognitoDomain}/signup?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoJWTHashForTest() {
    return '#id_token=eyJraWQiOiI1OFRSSmJ3bFc4RlJJTmFiZllxak11d0V2empcLzBiMjBtTXBNejF2S1FUaz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiVmxiYlF4ZFRTRFBueWpha1I0anQzUSIsInN1YiI6IjkwYzE2ZTAyLTNmZGQtNDQ1OS05NjhlLWY0Nzk1YjY4MmJkMCIsImF1ZCI6IjJ1NnM3cHFrYzFncnExcXM0NjRmc2k4MmF0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiODUyN2ZkNmYtNjlkZC0xMWU5LWE3MzItZmI1YzQ3MzkwNmRkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTY0NzM1NzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0NHZDlXcTEzNiIsImNvZ25pdG86dXNlcm5hbWUiOiJqcG5lbHNvbiIsImV4cCI6MTU1NjQ3NzE3NSwiaWF0IjoxNTU2NDczNTc1LCJlbWFpbCI6ImpwbmVsc29uQHN0YW5mb3JkLmVkdSJ9.m0qATz5nCcCRWBBDOuKWV6_dJOyFHUNJ_0TqV86KFrhCD6515oVi5KbDDQkHZRra12hVRrZPb7pmB94NzfNgKsixxQ_H3ERtV1kbpiaWU--6XY5BY3AJKlumMzd-nqHJcE9hzQCvmuJI92nlGUbaSqCbjsM9O65e2Ay9bb-LfgNI771YdNBYsBGoB-27PqdN-BLHv9FwR0y1M41P6Ne2Gbctzr_AsZLMi34pnZa1OJwyvIG7A0JqcUSoJvuVwnAwSi-CTr3MeO1BfkraKREM6O9EsSNDR8XA7l0tXFvFdcKnNOKMSikCZHbtj6n4dK-nTvpRX4OVuinrqt2pYbNokw&access_token=eyJraWQiOiJyVDUwbnpEREVGOFJMWHJacTAzb0E2WW82NVBHdjFaQ3ZRWlBsdEE0Sm1vPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5MGMxNmUwMi0zZmRkLTQ0NTktOTY4ZS1mNDc5NWI2ODJiZDAiLCJldmVudF9pZCI6Ijg1MjdmZDZmLTY5ZGQtMTFlOS1hNzMyLWZiNWM0NzM5MDZkZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIGVtYWlsIiwiYXV0aF90aW1lIjoxNTU2NDczNTc1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9DR2Q5V3ExMzYiLCJleHAiOjE1NTY0NzcxNzUsImlhdCI6MTU1NjQ3MzU3NSwidmVyc2lvbiI6MiwianRpIjoiNDM2ZWNmZDctN2E0Yy00MTNjLWJmN2QtYTU1NGQ3Y2FlMjFkIiwiY2xpZW50X2lkIjoiMnU2czdwcWtjMWdycTFxczQ2NGZzaTgyYXQiLCJ1c2VybmFtZSI6ImpwbmVsc29uIn0.bD_eNuXzqhjFHXhaHPF80y2d4j8Hr5UxEyGiQO4QpNEyZ2MtPsOXTaTSh_oG0aJeVQJKxXUF25RP5PInCxf0OIwxwdj3VAR_D4XohFYgRbkFCtkWMj7A1CM-Wnb8N19XvHbZUznNLyVoDHhR5QteIWGoD48H6hnmsIYM8ckZ2wVxx_WAMXIQeMq8HPGidqlD9sOjDgUSPOJO1VIt62QPGH601swN0yO5HdMPyA1lda6OrjFwOirobs0UTTzP2Z_3FcGeIYhY6of0LfKI7mHmGUtVrzHgZ--UqR1H4cZho2qN-3KJEVBwB46y-Lx2uyQis8nTCUXQhLYVEgiavuUs8g&expires_in=3600&token_type=Bearer'
  }

  static get awsCognitoIdToken() {
    return 'eyJraWQiOiI1OFRSSmJ3bFc4RlJJTmFiZllxak11d0V2empcLzBiMjBtTXBNejF2S1FUaz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiVmxiYlF4ZFRTRFBueWpha1I0anQzUSIsInN1YiI6IjkwYzE2ZTAyLTNmZGQtNDQ1OS05NjhlLWY0Nzk1YjY4MmJkMCIsImF1ZCI6IjJ1NnM3cHFrYzFncnExcXM0NjRmc2k4MmF0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiODUyN2ZkNmYtNjlkZC0xMWU5LWE3MzItZmI1YzQ3MzkwNmRkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTY0NzM1NzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0NHZDlXcTEzNiIsImNvZ25pdG86dXNlcm5hbWUiOiJqcG5lbHNvbiIsImV4cCI6MTU1NjQ3NzE3NSwiaWF0IjoxNTU2NDczNTc1LCJlbWFpbCI6ImpwbmVsc29uQHN0YW5mb3JkLmVkdSJ9.m0qATz5nCcCRWBBDOuKWV6_dJOyFHUNJ_0TqV86KFrhCD6515oVi5KbDDQkHZRra12hVRrZPb7pmB94NzfNgKsixxQ_H3ERtV1kbpiaWU--6XY5BY3AJKlumMzd-nqHJcE9hzQCvmuJI92nlGUbaSqCbjsM9O65e2Ay9bb-LfgNI771YdNBYsBGoB-27PqdN-BLHv9FwR0y1M41P6Ne2Gbctzr_AsZLMi34pnZa1OJwyvIG7A0JqcUSoJvuVwnAwSi-CTr3MeO1BfkraKREM6O9EsSNDR8XA7l0tXFvFdcKnNOKMSikCZHbtj6n4dK-nTvpRX4OVuinrqt2pYbNokw'
  }

  static get awsCognitoAccessToken() {
    return 'eyJraWTigJ064oCdQUJDMTIzPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNo4oCdOuKAnWExYjJjM+KAnSzigJ1zdWLigJ064oCdYTEtYjItYzMtZDQtZTXigJ0s4oCdYXVk4oCdOuKAnWExYjJjM2Q0ZTXigJ0s4oCdZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lk4oCdOuKAnWExLWIyLWMzLWQ04oCdLOKAnXRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1l4oCdOjU1NTU1NTU1NTUs4oCdaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfQ0dkOVdxMTM2IiwiY29nbml0bzp1c2VybmFtZSI6InNpbm9waWEtZGV2c19jbGllbnQtdGVzdGVyIiwiZXhw4oCdOjU1NTU1NTU1NTUs4oCdaWF04oCdOjU1NTU1NTU1NTUs4oCdZW1haWwiOiJzaW5vcGlhLWRldnMrY2xpZW50LXRlc3RlckBsaXN0cy5zdGFuZm9yZC5lZHUifQ.QGFiYyQxMjM'
  }
}

export default Config
