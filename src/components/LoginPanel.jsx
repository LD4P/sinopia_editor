// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import Config from '../Config.js'

class LoginPanel extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const AuthButton = withRouter(() =>
        this.props.jwtAuth.isAuthenticated ? (
          <p>
            Welcome!{" "}
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

    if (this.props.jwtAuth.isAuthenticated) {
      loginButton = <p/>;
    }

    return(
      <form className="login-form">
        <div className="form-group">
          <div className="row">
            <AuthButton jwtAuth={this.props.jwtAuth} signout={this.props.signout}/>
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
  jwtAuth: PropTypes.object
}

export default LoginPanel
