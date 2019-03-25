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

    it('aws client ID has static value', () => {
      expect(Config.awsClientID).toEqual('2u6s7pqkc1grq1qs464fsi82at')
    })

    it('aws cognito domain has static value', () => {
      expect(Config.awsCognitoDomain).toEqual('sinopia-development.auth.us-west-2.amazoncognito.com')
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
            'eyJraWQiOiJZa1ZFamRXUldveVU3alZlWVlvSzNmRzJpOFhDbTRUbFFFUEpsNFBRWEZJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiWjNvUlVua09FU3Jpd05LNHBpR19OdyIsInN1YiI6IjNiOTQ0ODQxLTY2NzEtNDIzYi04NjIyLWVmNTVhMjhlMWRlMyIsImF1ZCI6IjU0M2Nhdjk1dTBxMXJxY2FnczFuZWRjNjhhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNWE1MTc5YjUtNDUwNi0xMWU5LWI2MzQtYjdlNjk0NzdhNDhkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTI0MjI5MjAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0hVbU5JZG1oeSIsImNvZ25pdG86dXNlcm5hbWUiOiJjaS1lZGl0b3ItdXNlciIsImV4cCI6MTU1MjQyNjUyMCwiaWF0IjoxNTUyNDIyOTIwLCJlbWFpbCI6ImpncmViZW5Ac3RhbmZvcmQuZWR1In0.etfYjc2CSeWOFey9npSpV_dgSQw6ufjaQmEf2lOZ4bzwTYPQ6IFLoetUKPaPQ5jUQWbZwkXA-SV5BsM-t0GRHO6z3VJNLZxwExP1nAJKV-mneWieqBJCr6YBlD-wD-Dn-G3v5uEtx5Ha-ZexfY4YDBMSuUd9uiJhwjiuxAIrp66ZahiW0MuaUNdStRd1X2JGJ2q4TQTLDvVQ0lnuMk6yfD5RDG2oujldJuSMWOJXuMK9DCA-H_xerWYDLEdfa0H8xKOpIsRcx6aIKfOsuv9v57bWonAe11La3UZGyaGf2QyXzMhdEyJSfKynauCfauOtWkvyYx7BuiP8r0v5sFY5EQ'
          )
      })

      it('produces a Cognito id_token in development mode for ease of access', () => {
        expect(Config.awsCognitoAccessToken).toEqual(
          'eyJraWQiOiJBaHRJUGtMcUdaR0pFUTkyNmNQckJVdXdqQTZXVTZDNVB2TWJVb0pKQUNvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzYjk0NDg0MS02NjcxLTQyM2ItODYyMi1lZjU1YTI4ZTFkZTMiLCJldmVudF9pZCI6IjVhNTE3OWI1LTQ1MDYtMTFlOS1iNjM0LWI3ZTY5NDc3YTQ4ZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIGVtYWlsIiwiYXV0aF90aW1lIjoxNTUyNDIyOTIwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9IVW1OSWRtaHkiLCJleHAiOjE1NTI0MjY1MjAsImlhdCI6MTU1MjQyMjkyMCwidmVyc2lvbiI6MiwianRpIjoiYmE2OWRmMjctOTMzYi00YmM2LTkwYzMtMTJhOWQyNjMxODljIiwiY2xpZW50X2lkIjoiNTQzY2F2OTV1MHExcnFjYWdzMW5lZGM2OGEiLCJ1c2VybmFtZSI6ImNpLWVkaXRvci11c2VyIn0.DGcawIURydWlaENsKHLFaENdrX8706so4b0ISFvy1_KeIBGA6y4lDPQVktXQpQTsZRpgTBOs6N3i7lZjE2SquKTzwkOQ0LyRmwxOwJ2YByNqrQO4-vhs7PHGi6rd_HLBphasjGXfWL_kyzyguWVv2o800AJleK5WXeIkKCFSb0ECyTa6FfsbtIqc-Bc71RroB1gxUg71hDt9XnG8mlkWMYPPFKt06WNQZPnUFwn2A1vP7zOCHYpVN850k7--MWvDWDMCWbTDcq_auj3DdvDEIRZ8-vulCd_VWig89TekEGhcZ4ra8JBN02U1LdB5ZyGIBIPdDvrufge52kqn7uW6Cg'
        )
      })
    })

  })

  describe('static environmental values overrides', () => {

    beforeAll(() => {
      process.env = {
        SINOPIA_URI: 'sinopia.foo',
        COGNITO_CLIENT_ID: '1a2b3c',
        AWS_COGNITO_DOMAIN: 'sinopia-foo.amazoncognito.com'
      }
    })

    it('sinopia url has static value', () => {
      expect(Config.sinopiaUrl).toEqual('https://sinopia.foo')
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
