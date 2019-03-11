// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logIn, logOut } from '../actions/index'
import PropTypes from 'prop-types'
import Header from './Header'
import NewsPanel from './NewsPanel'
import LoginData from '../../src/LoginData'
import Logout from '../../src/Logout'
import DescPanel from './DescPanel'
import { saveState } from '../localStorage'
const qs = require('query-string')
const _ = require('lodash')

class HomePage extends Component {
  constructor(props) {
    super(props)
  }

  logOut = () => {
    this.props.signout()
    const logout = new Logout()
    logout.stateLogout()
    logout.cognitoLogout()
  }

  render() {
    const jwtHash = qs.parse(this.props.location.hash)
    const loginData = new LoginData()
    const userName = loginData.cognitoLoginData(jwtHash.access_token)

    if (!this.props.jwtAuth.isAuthenticated) {
      if(!_.isEmpty(jwtHash)) {
        jwtHash['username'] = userName
        this.props.authenticate(jwtHash)
      }
    } else {
      saveState(this.props.jwtAuth)
    }

    return(
      <div id="home-page">
        <Header triggerHomePageMenu={this.props.triggerHandleOffsetMenu} />
        <NewsPanel logOut={this.logOut} />
        <DescPanel />
      </div>
    )
  }
}

HomePage.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  location: PropTypes.object,
  jwtAuth: PropTypes.object,
  authenticate: PropTypes.func,
  signout: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    jwtAuth: state.authenticate.loginJwt
  }
}

const mapDispatchToProps = dispatch => ({
  authenticate(jwt){
    dispatch(logIn(jwt))
  },
  signout() {
    dispatch(logOut())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
// export default HomePage