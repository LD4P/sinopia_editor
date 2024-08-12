// Copyright 2019 Stanford University see LICENSE for license

class Config {
  static get rootResourceTemplateId() {
    return process.env.ROOT_RESOURCE_TEMPLATE_ID || "sinopia:template:resource"
  }

  static get sinopiaApiBase() {
    return process.env.SINOPIA_API_BASE_URL || "http://localhost:3000"
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
      return process.env.USE_FIXTURES === "true"
    }

    return false
  }

  static get useLanguageFixtures() {
    return false
  }

  static get sinopiaUrl() {
    return process.env.SINOPIA_URI || "https://sinopia.io"
  }

  static get sinopiaEnv() {
    if (process.env.SINOPIA_ENV) {
      return ` - ${process.env.SINOPIA_ENV}`
    }

    // We do not set this value in production, and don't want to see the env label in production
    return ""
  }

  static get indexUrl() {
    return process.env.INDEX_URL || "http://localhost:9200"
  }

  /*
   * The host for the public endpoint for the Sinopia search.  This is different than
   * the indexURL because it's the path to the public proxy endpoint, not directly to elasticsearch.
   * In development we may want to set this to `//localhost:8000`, but when deployed typically
   * the default (empty string) will work as the search is proxied through the same server
   * that hosts the client javascript.
   */
  static get searchHost() {
    return process.env.SEARCH_HOST || ""
  }

  static get searchResultsPerPage() {
    return 10
  }

  static get templateSearchResultsPerPage() {
    // This # should be large enough to return all results.
    return 250
  }

  /*
   * This is the public endpont for the sinopia search.
   */
  static get searchPath() {
    return "/api/search/sinopia_resources/_search"
  }

  static get templateSearchPath() {
    return "/api/search/sinopia_templates/_search"
  }

  static get sinopiaDomainName() {
    return `${this.sinopiaUrl}`.replace("https://", "")
  }

  static get sinopiaHelpAndResourcesMenuContent() {
    return "https://ld4p.github.io/sinopia/help_and_resources/menu_content.html"
  }

  static get awsCognitoDomain() {
    return (
      process.env.AWS_COGNITO_DOMAIN ||
      "https://sinopia-development.auth.us-west-2.amazoncognito.com"
    )
  }

  static get awsClientID() {
    return process.env.COGNITO_CLIENT_ID || "2u6s7pqkc1grq1qs464fsi82at"
  }

  static get awsCognitoForgotPasswordUrl() {
    return `${this.awsCognitoDomain}/forgotPassword?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoResetPasswordUrl() {
    return `${this.awsCognitoDomain}/signup?response_type=token&client_id=${this.awsClientID}&redirect_uri=${this.sinopiaUrl}`
  }

  static get awsCognitoUserPoolId() {
    return process.env.COGNITO_USER_POOL_ID || "us-west-2_CGd9Wq136"
  }

  static get cognitoTestUserName() {
    return process.env.COGNITO_TEST_USER_NAME
  }

  static get cognitoTestUserPass() {
    return process.env.COGNITO_TEST_USER_PASS
  }

  static get maxRecordsForQALookups() {
    return process.env.MAX_RECORDS_FOR_QA_LOOKUPS || 20
  }

  static get qaUrl() {
    return process.env.QA_URL || "https://lookup.ld4l.org"
  }

  static get exportBucketUrl() {
    return (
      process.env.EXPORT_BUCKET_URL ||
      "https://sinopia-exports-development.s3-us-west-2.amazonaws.com"
    )
  }

  static get honeybadgerApiKey() {
    return process.env.HONEYBADGER_API_KEY || ""
  }

  static get honeybadgerRevision() {
    return process.env.HONEYBADGER_REVISION || ""
  }

  static get transferConfig() {
    return {
      ils: {
        // group: label
        stanford: "Catalog",
        cornell: "Catalog",
        penn: "Catalog",
      },
      // Can add additional transfer targets, e.g., discovery
    }
  }

  static get defaultLanguageId() {
    return "en"
  }
}

export default Config
