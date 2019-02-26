class Config {
  static get sinopiaUri() {
    return process.env.SINOPIA_URI || 'https://sinopia.io'
  }

  static get awsClientID() {
    return process.env.AWS_CLIENT_ID || '69u288s9ia8ible8gg1n4k0gou'
  }

  static get awsCognitoDomain() {
    return process.env.AWS_COGNITO_DOMAIN || 'sinopia-development.auth.us-west-2.amazoncognito.com'
  }

  static get awsCognitoLoginUrl() {
    return `https://${this.awsCognitoDomain}/login?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUri}`
  }

  static get awsCognitoLogoutUrl() {
    return `https://${this.awsCognitoDomain}/logout?response_type=token&client_id=${this.awsClientID}&logout_uri=${this.sinopiaUri}&redirect_uri=${this.sinopiaUri}`
  }

  static get awsCognitoForgotPasswordUrl() {
    return `https://${this.awsCognitoDomain}/forgotPassword?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUri}`
  }

  static get awsCognitoResetPasswordUrl() {
    return `https://${this.awsCognitoDomain}/signup?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUri}`
  }
}

export default Config