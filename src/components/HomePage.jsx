// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logIn, logOut } from '../actions/index'
import PropTypes from 'prop-types'
import Header from './Header'
import NewsPanel from './NewsPanel'
import Logout from '../../src/Logout'
import DescPanel from './DescPanel'
const qs = require('query-string')
const _ = require('lodash')

class HomePage extends Component {
  constructor(props) {
    super(props)
  }

  logOut = () => {
    this.props.signout()
    const logout = new Logout()
    logout.cognitoLogout()
  }

  render() {
    const jwtHash = qs.parse(this.props.location.hash)
    const user = this.props.jwtAuth

    if (user !== undefined) {
      if (!user.isAuthenticated) {
        if(!_.isEmpty(jwtHash)) {
          this.props.authenticate(jwtHash)
        }
      }
    }

    return(
      <div id="home-page">
        <Header triggerHomePageMenu={this.props.triggerHandleOffsetMenu} />
        <NewsPanel jwtAuth={this.props.jwtAuth} logOut={this.logOut}/>
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
