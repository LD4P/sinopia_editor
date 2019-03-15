import Config from '../src/Config'

const OLD_ENV = process.env

describe('Config', () => {
  describe('static default values', () => {
    it('sinopia uri has static value', () => {
      expect(Config.sinopiaDomainName).toEqual('sinopia.io')
    })

    it('sinopia url has static value', () => {
      expect(Config.sinopiaUrl).toEqual('https://sinopia.io')
    })

    it('spoof sinopia server has static value', () => {
      expect(Config.spoofSinopiaServer).toEqual(true)
    })

    it('aws client ID has static value', () => {
      expect(Config.awsClientID).toEqual('2u6s7pqkc1grq1qs464fsi82at')
    })

    it('aws cognito domain has static value', () => {
      expect(Config.awsCognitoDomain).toEqual('sinopia-development.auth.us-west-2.amazoncognito.com')
    })

    describe('interpolated links from default values', () => {
      it('', () => {
        expect(Config.awsCognitoLoginUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/login?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`
        )
      })

      it('', () => {
        expect(Config.awsCognitoLogoutUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/logout?response_type=token&client_id=${Config.awsClientID}&logout_uri=https://sinopia.io&redirect_uri=https://sinopia.io`
        )
      })

      it('', () => {
        expect(Config.awsCognitoForgotPasswordUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/forgotPassword?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`
        )
      })

      it('', () => {
        expect(Config.awsCognitoResetPasswordUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/signup?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`
        )
      })
    })

  })

  describe('static environmental values overrides', () => {

    beforeAll(() => {
      process.env = {
        SPOOF_SINOPIA_SERVER: 'false',
        SINOPIA_URI: 'sinopia.foo',
        COGNITO_CLIENT_ID: '1a2b3c',
        AWS_COGNITO_DOMAIN: 'sinopia-foo.amazoncognito.com'
      }
    })

    it('sinopia url has static value', () => {
      expect(Config.sinopiaUrl).toEqual('https://sinopia.foo')
    })

    it('spoof sinopia server has static value', () => {
      expect(Config.spoofSinopiaServer).toEqual(false)
    })

    it('aws client ID has static value', () => {
      expect(Config.awsClientID).toEqual('1a2b3c')
    })

    it('aws cognito domain has static value', () => {
      expect(Config.awsCognitoDomain).toEqual('sinopia-foo.amazoncognito.com')
    })

    describe('interpolated links from environmental overrides', () => {
      it('', () => {
        expect(Config.awsCognitoLoginUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/login?response_type=token&client_id=1a2b3c&redirect_uri=https://sinopia.foo'
        )
      })

      it('', () => {
        expect(Config.awsCognitoLogoutUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/logout?response_type=token&client_id=1a2b3c&logout_uri=https://sinopia.foo&redirect_uri=https://sinopia.foo'
        )
      })

      it('', () => {
        expect(Config.awsCognitoForgotPasswordUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/forgotPassword?response_type=token&client_id=1a2b3c&redirect_uri=https://sinopia.foo'
        )
      })

      it('', () => {
        expect(Config.awsCognitoResetPasswordUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/signup?response_type=token&client_id=1a2b3c&redirect_uri=https://sinopia.foo'
        )
      })
    })

    afterAll(() => {
      process.env = OLD_ENV
    })
  })

})
