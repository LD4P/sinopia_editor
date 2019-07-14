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
   *     a. When set to 'true' return `true` (use fixtures)
   *     b. When set to 'false' or any other string, return `false` (don't use fixtures)
   */
  static get useResourceTemplateFixtures() {
    if (process.env.USE_FIXTURES) {
      return process.env.USE_FIXTURES === 'true'
    }

    return false
  }

  static get awsClientID() {
    return process.env.COGNITO_CLIENT_ID || '2u6s7pqkc1grq1qs464fsi82at'
  }

  static get sinopiaUrl() {
    return process.env.SINOPIA_URI || 'https://sinopia.io'
  }

  static get indexUrl() {
    return process.env.INDEX_URL || 'http://localhost:9200'
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

  static get maxRecordsForQALookups() {
    return process.env.MAX_RECORDS_FOR_QA_LOOKUPS || 8
  }

  // WARNING: the groups section in config/default.js in the sinopia_acl codebase *must* be kept in sync with this section
  static get groupsInSinopia() {
    return {
      alberta: 'University of Alberta',
      boulder: 'University of Colorado, Boulder',
      chicago: 'University of Chicago',
      cornell: 'Cornell University',
      dlc: 'Library of Congress',
      duke: 'Duke University',
      frick: 'Frick Art Reference Library',
      harvard: 'Harvard University',
      hrc: 'University of Texas, Austin, Harry Ransom Center',
      ld4p: 'LD4P',
      michigan: 'University of Michigan',
      minnesota: 'University of Minnesota',
      nlm: 'National Library of Medicine',
      northwestern: 'Northwestern University',
      pcc: 'PCC',
      penn: 'University of Pennsylvania',
      princeton: 'Princeton University',
      stanford: 'Stanford University',
      tamu: 'Texas A&M University',
      ucdavis: 'University of California, Davis',
      ucsd: 'University of California, San Diego',
      washington: 'University of Washington',
      yale: 'Yale University',
    }
  }
}

export default Config
