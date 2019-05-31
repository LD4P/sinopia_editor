// Copyright 2018 Stanford University see LICENSE for license

class Config {
  static get defaultSinopiaGroupId() {
    return process.env.SINOPIA_GROUP || 'ld4p'
  }

  static get defaultProfileSchemaVersion() {
    return process.env.DEFAULT_PROFILE_SCHEMA_VERSION || '0.0.3'
  }

  static get sinopiaServerBase() {
    return process.env.TRELLIS_BASE_URL || 'http://localhost:8080'
  }

  static get awsCognitoDomain() {
    return process.env.AWS_COGNITO_DOMAIN || 'https://sinopia-development.auth.us-west-2.amazoncognito.com'
  }

  /*
   * There are two value types of `process.env` variables:
   *   1. When undefined, `if` condition is not satisfied and default `false` is returned
   *   2. When defined, will always be a string.
   *     a. When set to 'true' return `true` (use spoof)
   *     b. When set to 'false' or any other string, return `false` (don't use spoof)
   */
  static get spoofSinopiaServer() {
    if (process.env.SPOOF_SINOPIA_SERVER) {
      return process.env.SPOOF_SINOPIA_SERVER === 'true'
    }

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

  static get awsCognitoForgotPasswordUrl() {
    return `${this.awsCognitoDomain}/forgotPassword?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoResetPasswordUrl() {
    return `${this.awsCognitoDomain}/signup?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoUserPoolId() {
    return process.env.COGNITO_USER_POOL_ID || 'us-west-2_CGd9Wq136'
  }

  static get cognitoTestUserName() {
    return process.env.COGNITO_TEST_USER_NAME
  }

  static get cognitoTestUserPass() {
    return process.env.COGNITO_TEST_USER_PASS
  }
}

export default Config
