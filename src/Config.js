class Config {
  static get sinopiaDomainName() {
    return process.env.SINOPIA_URI || 'sinopia.io'
  }

  static get sinopiaUrl() {
    return `https://${this.sinopiaDomainName}`
  }

  static get awsClientID() {
    return process.env.COGNITO_CLIENT_ID || '543cav95u0q1rqcags1nedc68a'
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
}

export default Config
