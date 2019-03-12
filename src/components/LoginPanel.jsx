// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import Config from '../Config.js'
import { loadState } from '../localStorage'

class LoginPanel extends Component {
  constructor(props){
    super(props)
    this.state = {
      userAuthenticated: false
    }
  }

  render(){
    const user = loadState('jwtAuth')
    if (user !== undefined && user.isAuthenticated) {
      if (!this.state.userAuthenticated) {
        this.setState({userAuthenticated: true, userName: user.username})
      }
    }

    const AuthButton = withRouter(() =>
        (this.state.userAuthenticated) ? (
          <p>
            Welcome{` ${this.state.userName}`}!
            <button onClick={() => {
              this.props.logOut()
            }}>
              Sign out
            </button>
          </p>
        ) : (
        <p>You are not logged in.</p>
      )
    )

    let loginButton = <div className="col-xs-6">
      <NavLink className="btn btn-block btn-primary nav-link" type="button" to="/login">Login</NavLink>
    </div>;

    if (this.state.userAuthenticated) {
      loginButton = <p/>;
    }

    return(
      <form className="login-form">
        <div className="form-group">
          <div className="row">
            <AuthButton />
            {loginButton}
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
      </form>
    )
  }
}

LoginPanel.propTypes = {
  signout: PropTypes.func,
  logOut: PropTypes.func,
  jwtAuth: PropTypes.object,
  userName: PropTypes.string
}

export default LoginPanel
