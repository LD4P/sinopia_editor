import Config from '../src/Config'

const OLD_ENV = process.env

describe('Config', () => {
  describe('static default values', () => {
    it('sinopia has a default schema version', () => {
      expect(Config.defaultProfileSchemaVersion).toEqual('0.0.2')
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

    it('spoof sinopia server has static value', () => {
      expect(Config.spoofSinopiaServer).toEqual(false)
    })

    it('aws client ID has static value', () => {
      expect(Config.awsClientID).toEqual('2u6s7pqkc1grq1qs464fsi82at')
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

    describe('interpolated links from default values', () => {
      it('produces the Cognito Login URL', () => {
        expect(Config.awsCognitoLoginUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/login?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`
        )
      })

      it('produces the Cognito Logout URL', () => {
        expect(Config.awsCognitoLogoutUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/logout?response_type=token&client_id=${Config.awsClientID}&logout_uri=https://sinopia.io&redirect_uri=https://sinopia.io`
        )
      })

      it('produces the Cognito Forgot Password URL', () => {
        expect(Config.awsCognitoForgotPasswordUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/forgotPassword?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`
        )
      })

      it('produces the Cognito Reset Password URL', () => {
        expect(Config.awsCognitoResetPasswordUrl).toEqual(
          `https://sinopia-development.auth.us-west-2.amazoncognito.com/signup?response_type=token&client_id=${Config.awsClientID}&redirect_uri=https://sinopia.io`
        )
      })

      it('produces a Cognito id_token in development mode for ease of access', () => {
        expect(Config.awsCognitoIdToken).toEqual(
          'eyJraWQiOiI1OFRSSmJ3bFc4RlJJTmFiZllxak11d0V2empcLzBiMjBtTXBNejF2S1FUaz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiUEJDLTdsazlITWtwYkpjdjlXYlluZyIsInN1YiI6Ijc4OWRkYTdkLTI1YzAtNGE4Zi05YzYyLWIzMTE2YTk3Y2M5YiIsImF1ZCI6IjJ1NnM3cHFrYzFncnExcXM0NjRmc2k4MmF0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNjNjMjJhYmYtNWZkNi0xMWU5LWEwN2ItZTlmZTA3NzQxN2ZkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTUzNzEwMDEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0NHZDlXcTEzNiIsImNvZ25pdG86dXNlcm5hbWUiOiJzaW5vcGlhLWRldnNfY2xpZW50LXRlc3RlciIsImV4cCI6MTU1NTM3NDYwMSwiaWF0IjoxNTU1MzcxMDAxLCJlbWFpbCI6InNpbm9waWEtZGV2cytjbGllbnQtdGVzdGVyQGxpc3RzLnN0YW5mb3JkLmVkdSJ9.JMf4p2teIsL3DDFgHsaqdAEd_kf0WytEsi00TsfhAIzVUglAvAYg5OZkFToE1vEjzvZH9HXhNSj6PT2DpO5HPhuWLvbGyw7dX_MfZpxO7wlIBhgy2FhRLkcytgEzyfMQEtDvRMD0-HUVpGBjwV4bteILl0cwi_MZ8y0U81Etn7QTDSUPE1bilGOBFKveLw8lzgiNJcJkRZbRc2FVoPvfVqSoq8iH2FXuw1HoY7lBWIBVAeq8ETBxBRHJc7xoN7S8YcARXnsyFJrmdAgHFs-rt5639ts1eNlXnen6sBIlVhOwaekBZgX0twEg8vZvsNK0L3GRjyVDNPB6f281DDfQtg.QGFiYyQxMjM'
        )
      })

      it('produces a Cognito id_token in development mode for ease of access', () => {
        expect(Config.awsCognitoAccessToken).toEqual(
          'eyJraWTigJ064oCdQUJDMTIzPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNo4oCdOuKAnWExYjJjM+KAnSzigJ1zdWLigJ064oCdYTEtYjItYzMtZDQtZTXigJ0s4oCdYXVk4oCdOuKAnWExYjJjM2Q0ZTXigJ0s4oCdZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lk4oCdOuKAnWExLWIyLWMzLWQ04oCdLOKAnXRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1l4oCdOjU1NTU1NTU1NTUs4oCdaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfQ0dkOVdxMTM2IiwiY29nbml0bzp1c2VybmFtZSI6InNpbm9waWEtZGV2c19jbGllbnQtdGVzdGVyIiwiZXhw4oCdOjU1NTU1NTU1NTUs4oCdaWF04oCdOjU1NTU1NTU1NTUs4oCdZW1haWwiOiJzaW5vcGlhLWRldnMrY2xpZW50LXRlc3RlckBsaXN0cy5zdGFuZm9yZC5lZHUifQ.QGFiYyQxMjM'
        )
      })
    })

  })

  describe('static environmental values overrides', () => {

    beforeAll(() => {
      process.env = {
        DEFAULT_PROFILE_SCHEMA_VERSION: '0.1.0',
        SPOOF_SINOPIA_SERVER: 'true',
        SINOPIA_URI: 'https://sinopia.foo',
        SINOPIA_GROUP: 'foobar',
        TRELLIS_BASE_URL: 'https://sinopia_server.foo',
        COGNITO_CLIENT_ID: '1a2b3c',
        AWS_COGNITO_DOMAIN: 'https://sinopia-foo.amazoncognito.com'
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

    it('sinopia server url overrides static value', () => {
      expect(Config.sinopiaServerBase).toEqual('https://sinopia_server.foo')
    })

    it('spoof sinopia server overrides static value', () => {
      expect(Config.spoofSinopiaServer).toEqual(true)
    }
)
    it('aws client ID overrides static value', () => {
      expect(Config.awsClientID).toEqual('1a2b3c')
    })

    it('aws cognito domain overrides static value', () => {
      expect(Config.awsCognitoDomain).toEqual('https://sinopia-foo.amazoncognito.com')
    })

    describe('interpolated links from environmental overrides', () => {
      it('interpolates the cognito login url', () => {
        expect(Config.awsCognitoLoginUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/login?response_type=token&client_id=1a2b3c&redirect_uri=https://sinopia.foo'
        )
      })

      it('interpolates the cognito logout url', () => {
        expect(Config.awsCognitoLogoutUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/logout?response_type=token&client_id=1a2b3c&logout_uri=https://sinopia.foo&redirect_uri=https://sinopia.foo'
        )
      })

      it('interpolates the forgot password url', () => {
        expect(Config.awsCognitoForgotPasswordUrl).toEqual(
          'https://sinopia-foo.amazoncognito.com/forgotPassword?response_type=token&client_id=1a2b3c&redirect_uri=https://sinopia.foo'
        )
      })

      it('interpolates the reset password url', () => {
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
