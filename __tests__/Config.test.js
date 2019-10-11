// Copyright 2018 Stanford University see LICENSE for license

import Config from '../src/Config'

const OLD_ENV = process.env

describe('Config', () => {
  describe('static default values', () => {
    it('sinopia has a default schema version', () => {
      expect(Config.defaultProfileSchemaVersion).toEqual('0.0.3')
    })

    it('sinopia domain name has static value', () => {
      expect(Config.sinopiaDomainName).toEqual('sinopia.io')
    })

    it('default sinopia group id has static value', () => {
      expect(Config.defaultSinopiaGroupId).toEqual('ld4p')
    })

    it('sinopia url has static value', () => {
      expect(Config.sinopiaUrl).toEqual('https://sinopia.io')
    })

    it('sinopia env has static value', () => {
      expect(Config.sinopiaEnv).toEqual('')
    })

    it('index url has static value', () => {
      expect(Config.indexUrl).toEqual('http://localhost:9200')
    })

    it('useResourceTemplateFixtures is false by default', () => {
      expect(Config.useResourceTemplateFixtures).toEqual(false)
    })

    it('aws client ID has static value', () => {
      expect(Config.awsClientID).toEqual('2u6s7pqkc1grq1qs464fsi82at')
    })

    it('aws cognito user pool ID has static value', () => {
      expect(Config.awsCognitoUserPoolId).toEqual('us-west-2_CGd9Wq136')
    })

    it('aws cognito domain has static value', () => {
      expect(Config.awsCognitoDomain).toEqual('https://sinopia-development.auth.us-west-2.amazoncognito.com')
    })

    it('sinopia help and resource menu content has a link to github pages', () => {
      expect(Config.sinopiaHelpAndResourcesMenuContent).toEqual('https://ld4p.github.io/sinopia/help_and_resources/menu_content.html')
    })

    it('sinopia server url has a static value', () => {
      expect(Config.sinopiaServerBase).toEqual('http://localhost:8080')
    })

    it('max records for lookups/QA has static value', () => {
      expect(Config.maxRecordsForQALookups).toEqual(8)
    })

    describe('interpolated links from default values', () => {
      it('produces the Cognito Forgot Password URL', () => {
        expect(Config.awsCognitoForgotPasswordUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/forgotPassword?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`,
        )
      })

      it('produces the Cognito Reset Password URL', () => {
        expect(Config.awsCognitoResetPasswordUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/signup?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`,
        )
      })
    })
  })

  describe('static environmental values overrides', () => {
    beforeAll(() => {
      process.env = {
        DEFAULT_PROFILE_SCHEMA_VERSION: '0.1.0',
        USE_FIXTURES: 'true',
        SINOPIA_URI: 'https://sinopia.foo',
        SINOPIA_ENV: 'TEST',
        SINOPIA_GROUP: 'foobar',
        TRELLIS_BASE_URL: 'https://sinopia_server.foo',
        COGNITO_CLIENT_ID: '1a2b3c',
        COGNITO_USER_POOL_ID: 'us-west-7_CGd9Wq142',
        AWS_COGNITO_DOMAIN: 'https://sinopia-foo.amazoncognito.com',
        MAX_RECORDS_FOR_QA_LOOKUPS: 15,
        INDEX_URL: 'http://elasticsearch.aws.example.com',
      }
    })

    it('sinopia has a default schema version', () => {
      expect(Config.defaultProfileSchemaVersion).toEqual('0.1.0')
    })

    it('default sinopia group id overrides static value', () => {
      expect(Config.defaultSinopiaGroupId).toEqual('foobar')
    })

    it('sinopia url overrides static value', () => {
      expect(Config.sinopiaUrl).toEqual('https://sinopia.foo')
    })

    it('sinopia env overrides static value for display', () => {
      expect(Config.sinopiaEnv).toEqual(' - TEST')
    })

    it('index url overrides static value', () => {
      expect(Config.indexUrl).toEqual('http://elasticsearch.aws.example.com')
    })

    it('sinopia server url overrides static value', () => {
      expect(Config.sinopiaServerBase).toEqual('https://sinopia_server.foo')
    })

    it('useResourceTemplateFixtures value overrides static value', () => {
      expect(Config.useResourceTemplateFixtures).toEqual(true)
    })

    it('aws client ID overrides static value', () => {
      expect(Config.awsClientID).toEqual('1a2b3c')
    })

    it('aws cognito user pool id ID overrides static value', () => {
      expect(Config.awsCognitoUserPoolId).toEqual('us-west-7_CGd9Wq142')
    })

    it('aws cognito domain overrides static value', () => {
      expect(Config.awsCognitoDomain).toEqual('https://sinopia-foo.amazoncognito.com')
    })

    it('max records for lookups/QA environment variable overrides static value', () => {
      expect(Config.maxRecordsForQALookups).toEqual(15)
    })

    describe('interpolated links from environmental overrides', () => {
      it('interpolates the forgot password url', () => {
        expect(Config.awsCognitoForgotPasswordUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/forgotPassword?response_type=token&client_id=1a2b3c&redirect_uri=https://sinopia.foo',
        )
      })

      it('interpolates the reset password url', () => {
        expect(Config.awsCognitoResetPasswordUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/signup?response_type=token&client_id=1a2b3c&redirect_uri=https://sinopia.foo',
        )
      })
    })

    afterAll(() => {
      process.env = OLD_ENV
    })
  })
})
