// Copyright 2018 Stanford University see LICENSE for license

import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'
import Config from './Config'

class CognitoUtils {
  static authenticationDetails(username, password) {
    const authenticationData = {
      Username: username,
      Password: password,
    }


    return new AuthenticationDetails(authenticationData)
  }

  static cognitoUserPool() {
    const poolData = {
      UserPoolId: Config.awsCognitoUserPoolId,
      ClientId: Config.awsClientID,
    }


    return new CognitoUserPool(poolData)
  }

  static cognitoUser(username) {
    const userData = {
      Username: username,
      Pool: CognitoUtils.cognitoUserPool(),
    }


    return new CognitoUser(userData)
  }

  /*
   * A thin wrapper around CognitoUser.authenticateUser that instead returns a Promise, for easier composability than a plain callback.
   * the returned Promise resolves to the CognitoUserSession object from the success callback, or rejects with the error object from the
   * failure callback.
   */
  static authenticateUser(cognitoUser, password) {
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(CognitoUtils.authenticationDetails(cognitoUser.username, password), {
        onSuccess: (cognitoUserSession) => {
          resolve(cognitoUserSession)
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }

  /*
   * A thin wrapper around CognitoUser.getSession that instead returns a Promise, for easier composability than a plain callback.
   * the returned Promise resolves to the sessionData from the callback's success parameter, or rejects with the error object from
   * the callback's errInfo parameter.
   *
   * bonus: note that CognitoUser.authenticateUser uses a different callback pattern (a hash with separate success
   * and failure callbacks) than .getSession (a single callback with error and success parameters).  the Promise wrappers
   * give callers a more uniform API for interacting with asynchronous cognito session operations.
   */
  static getSession(cognitoUser) {
    return new Promise((resolve, reject) => {
      cognitoUser.getSession((errInfo, sessionData) => {
        if (errInfo) {
          reject(errInfo)
        } else {
          resolve(sessionData)
        }
      })
    })
  }

  /*
   * A thin wrapper around CognitoUtils.getSession.  returns a Promise which resolves to the value from
   * sessionData that's most often useful to other parts of the editor (the JWT ID token string).
   */
  static getIdTokenString(cognitoUser) {
    return CognitoUtils.getSession(cognitoUser).then((sessionData) => sessionData.idToken.jwtToken)
  }

  static handleSignout(currentUser, signedOut) {
    currentUser.globalSignOut({
      onSuccess: () => {
        signedOut()
      },
      onFailure: (err) => {
        // TODO: capture error in state so you can display an error somewhere in the UI
        alert(err.message)
        console.error(err)
      },
    })
  }
}

export default CognitoUtils
