// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Config from '../Config'
import CognitoUtils from '../CognitoUtils'
import { getAuthenticationError, getCurrentSession, getCurrentUser } from '../authSelectors'
import { authenticationFailed, authenticationSucceeded, signedOut } from '../actionCreators'

class LoginPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    /*
     * If the Cognito user info was just retrieved from local storage, as when the app first
     * loads, the session info we need won't be present on it.  However, the associated id,
     * access, and refresh tokens are all saved in local storage also. As such, the getSession()
     * method will attempt to use the refresh token (if present) to get new id and access tokens.
     */

    const currentUser = this.props.currentUser || CognitoUtils.cognitoUserPool().getCurrentUser()
    const currentSession = this.props.currentSession

    if (currentUser && !currentSession) {
      CognitoUtils.getSession(currentUser)
        .then((sessionData) => {
          this.props.authenticate({ currentUser, currentSession: sessionData })
        }).catch((errInfo) => {
          this.props.failToAuthenticate({ currentUser, authenticationError: errInfo })
        })
    }
  }

  handleLoginSubmit = (event) => {
    event.preventDefault()

    const cognitoUser = CognitoUtils.cognitoUser(this.state.username)

    CognitoUtils.authenticateUser(cognitoUser, this.state.password)
      .then((cognitoUserSession) => {
        this.props.authenticate({ currentUser: cognitoUser, currentSession: cognitoUserSession })
      }).catch((errInfo) => {
        this.props.failToAuthenticate({ currentUser: cognitoUser, authenticationError: errInfo })
      })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSignout = () => {
    this.props.currentUser.globalSignOut({
      onSuccess: () => {
        this.props.signout()
      },
      onFailure: (err) => {
        // TODO: capture error in state so you can display an error somewhere in the UI
        console.error(err)
      },
    })
  }

  render() {
    const currentUser = this.props.currentUser
    const currentSession = this.props.currentSession
    const authenticationError = this.props.authenticationError

    const currentUserInfoPanel = (
      <div className="row logged-in-user-info">
        <div>current cognito user: { currentUser ? currentUser.username : null }</div>
      </div>
    )

    const inlineLoginForm = (
      <div className="row">
        <div className = "form-group">
          <label htmlFor="username" className="text-uppercase">
            Username
            <input id="username" name="username" type="text" className="form-control" placeholder="" onChange={this.handleChange}></input>
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="text-uppercase">
            Password
            <input id="password" name="password" type="password" className="form-control" placeholder="" onChange={this.handleChange}></input>
          </label>
        </div>
        <div className="col-xs-6">
          <button className="btn btn-block btn-primary" type="submit">Login</button>
        </div>
        <div className="row">
          <div className="col-xs-8">
            <a href={Config.awsCognitoForgotPasswordUrl}><small>Forgot Password?</small></a>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-8">
            <a href={Config.awsCognitoResetPasswordUrl}><small>Request Account</small></a>
          </div>
        </div>
      </div>
    )

    const logoutButton = (
      <div className="row">
        <button className="signout-btn" onClick={this.handleSignout}>Sign out</button>
      </div>
    )

    /*
     * TODO:
     *   * polish the look of this now that it's been pulled up higher in component tree (directly in App)
     */
    return (
      <form className="login-form" onSubmit={this.handleLoginSubmit}>
        { currentUser ? currentUserInfoPanel : null }
        { authenticationError ? <div className="row error-message">{ authenticationError.message }</div> : null }
        { currentSession ? logoutButton : inlineLoginForm }
      </form>
    )
  }
}

LoginPanel.propTypes = {

  /*
   * separate props for currentUser, currentSession, authenticationError.  see https://redux.js.org/faq/react-redux#why-is-my-component-re-rendering-too-often
   *   "React Redux implements several optimizations to ensure your actual component only re-renders when actually necessary. One of those is a shallow equality
   *   check on the combined props object generated by the mapStateToProps and mapDispatchToProps arguments passed to connect. Unfortunately, shallow equality does
   *   not help in cases where new array or object instances are created each time mapStateToProps is called."
   */
  currentUser: PropTypes.object,
  currentSession: PropTypes.object,
  authenticationError: PropTypes.object,
  failToAuthenticate: PropTypes.func,
  authenticate: PropTypes.func,
  signout: PropTypes.func,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  currentSession: getCurrentSession(state),
  authenticationError: getAuthenticationError(state),
})

export default connect(
  mapStateToProps,
  {
    failToAuthenticate: authenticationFailed,
    authenticate: authenticationSucceeded,
    signout: signedOut,
  },
)(LoginPanel)
