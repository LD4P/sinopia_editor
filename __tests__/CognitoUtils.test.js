// Copyright 2018 Stanford University see LICENSE for license

import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'
import CognitoUtils from '../src/CognitoUtils'
import Config from '../src/Config'

describe('CognitoUtils', () => {
  const username = 'testuser'
  const password = 'testpass'

  describe('authenticationDetails()', () => {
    it('returns an instance of AuthenticationDetails with passed credentials', () => {
      const details = CognitoUtils.authenticationDetails(username, password)

      expect(details).toBeInstanceOf(AuthenticationDetails)
      expect(details.username).toEqual(username)
      expect(details.password).toEqual(password)
    })
  })

  describe('cognitoUserPool()', () => {
    it('returns an instance of CognitoUserPool with configured user pool and client IDs', () => {
      const pool = CognitoUtils.cognitoUserPool()

      expect(pool).toBeInstanceOf(CognitoUserPool)
      expect(pool.userPoolId).toEqual(Config.awsCognitoUserPoolId)
      expect(pool.clientId).toEqual(Config.awsClientID)
    })
  })

  describe('cognitoUser()', () => {
    it('returns an instance of CognitoUser with username and user pool', () => {
      const user = CognitoUtils.cognitoUser(username)

      expect(user).toBeInstanceOf(CognitoUser)
      expect(user.username).toEqual(username)
      expect(user.pool).toBeInstanceOf(CognitoUserPool)
      expect(user.pool).toEqual(CognitoUtils.cognitoUserPool())
    })
  })

  describe('authenticateUser()', () => {
    const user = CognitoUtils.cognitoUser(username)

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('returns a promise', () => {
      const authResult = CognitoUtils.authenticateUser(user, password)

      expect(authResult).toBeInstanceOf(Promise)
    })

    it('resolves on successful authentication', () => {
      const mockSession = {}
      const authUserSpy = jest.spyOn(user, 'authenticateUser').mockImplementation((_details, callbacksObject) => callbacksObject.onSuccess(mockSession))


      return CognitoUtils.authenticateUser(user, password)
        .then((authResult) => {
          expect(authUserSpy).toHaveBeenCalledTimes(1)
          expect(authResult).toEqual(mockSession)
        })
        .catch((error) => { throw error })
    })

    it('rejects on failed authentication', () => {
      const mockError = {}
      const authUserSpy = jest.spyOn(user, 'authenticateUser').mockImplementation((_details, callbacksObject) => callbacksObject.onFailure(mockError))


      return CognitoUtils.authenticateUser(user, password)
        .then((result) => { throw result })
        .catch((error) => {
          expect(authUserSpy).toHaveBeenCalledTimes(1)
          expect(error).toEqual(mockError)
        })
    })
  })

  describe('getSession()', () => {
    const user = CognitoUtils.cognitoUser(username)

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('returns a promise', () => {
      const result = CognitoUtils.getSession(user)

      expect(result).toBeInstanceOf(Promise)
    })

    it('resolves with session data when successful', () => {
      const mockError = null
      const mockSession = {}
      const getSessionSpy = jest.spyOn(user, 'getSession').mockImplementation((callbackFn) => callbackFn(mockError, mockSession))


      return CognitoUtils.getSession(user)
        .then((result) => {
          expect(getSessionSpy).toHaveBeenCalledTimes(1)
          expect(result).toEqual(mockSession)
        })
        .catch((error) => { throw error })
    })

    it('rejects with error info when failing', () => {
      const mockError = 'uh oh!'
      const getSessionSpy = jest.spyOn(user, 'getSession').mockImplementation((callbackFn) => callbackFn(mockError))


      return CognitoUtils.getSession(user)
        .then((result) => { throw result })
        .catch((error) => {
          expect(getSessionSpy).toHaveBeenCalledTimes(1)
          expect(error).toEqual(mockError)
        })
    })
  })

  describe('getIdTokenString()', () => {
    const user = CognitoUtils.cognitoUser(username)

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('returns a promise', () => {
      const result = CognitoUtils.getIdTokenString(user)

      expect(result).toBeInstanceOf(Promise)
    })

    it('resolves to a JSON web token string', () => {
      const token = 'eyjqew5u4yijrg09jh40ghi909tj9jgh...'
      const mockError = null
      const mockSession = {
        idToken: {
          jwtToken: token,
        },
      }
      const getSessionSpy = jest.spyOn(user, 'getSession').mockImplementation((callbackFn) => callbackFn(mockError, mockSession))


      return CognitoUtils.getIdTokenString(user)
        .then((result) => {
          expect(getSessionSpy).toHaveBeenCalledTimes(1)
          expect(result).toEqual(token)
        })
        .catch((error) => { throw error })
    })

    it('bubbles up the error if obtaining a session fails', () => {
      const mockError = 'refresh token expired (would be more complex error obj IRL)'
      const mockSession = null
      const getSessionSpy = jest.spyOn(user, 'getSession').mockImplementation((callbackFn) => callbackFn(mockError, mockSession))


      return CognitoUtils.getIdTokenString(user)
        .then((result) => { throw result })
        .catch((error) => {
          expect(getSessionSpy).toHaveBeenCalledTimes(1)
          expect(error).toEqual(mockError)
        })
    })
  })
})
