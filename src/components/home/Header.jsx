// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SinopiaLogo from 'styles/sinopia-logo.png'
import Config from 'Config'
import CognitoUtils from '../../CognitoUtils'
import { connect } from 'react-redux'
import { getCurrentUser } from 'authSelectors'
import { signedOut } from 'actionCreators/authenticate'
import { bindActionCreators } from 'redux'

class Header extends Component {
  render() {
    return (
      <div className="navbar homepage-navbar">
        <div className="navbar-header">
          <a className="navbar-brand" href={`${Config.sinopiaUrl}`}>
            <img src={SinopiaLogo} height="55px" alt="Sinopia logo" />
          </a>
        </div>
        <ul className= "nav">
          {this.props.currentUser
            && <li className="nav-item">
              <span className="nav-link editor-header-user">{this.props.currentUser.username}</span>
            </li>
          }
          <li className="nav-item">
            <Link to="/templates" className="nav-link">Linked Data Editor</Link>
          </li>
          <li className="nav-item">
            <a className="header-text nav-link" href={`https://profile-editor.${Config.sinopiaDomainName}/`}>Profile Editor</a>
          </li>
          <li className="menu nav-item">
            <a href="#" className="help-resources nav-link" onClick={this.props.triggerHomePageMenu}>Help and Resources</a>
          </li>
          {this.props.currentUser
            && <li className="nav-item">
              <a href="#" className="nav-link editor-header-logout"
                 onClick={() => CognitoUtils.handleSignout(this.props.currentUser, this.props.signedOut)}>Logout</a>
            </li>
          }
        </ul>
      </div>
    )
  }
}

Header.propTypes = {
  triggerHomePageMenu: PropTypes.func,
  currentUser: PropTypes.object,
  signedOut: PropTypes.func,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ signedOut }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
