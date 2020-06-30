// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SinopiaLogo from 'styles/sinopia-logo.png'
import Config from 'Config'
import CognitoUtils from 'utilities/CognitoUtils'
import { connect } from 'react-redux'
import { selectCurrentUser, selectCurrentSession } from 'selectors/authenticate'
import { signedOut } from 'actionCreators/authenticate'
import { bindActionCreators } from 'redux'

const Header = (props) => (
  <div className="navbar homepage-navbar">
    <div className="navbar-header">
      <a className="navbar-brand" href={`${Config.sinopiaUrl}`}>
        <img src={SinopiaLogo} height="55px" alt="Sinopia logo" />
      </a>
    </div>
    <ul className= "nav">
      {props.currentUser && props.currentSession
          && <React.Fragment>
            <li className="nav-item">
              <span className="nav-link editor-header-user">{props.currentUser.username}</span>
            </li>
            <li className="nav-item">
              <Link to="/templates" className="nav-link">Linked Data Editor</Link>
            </li>
          </React.Fragment>
      }
      <li className="nav-item">
        <a className="header-text nav-link" href={`https://profile-editor.${Config.sinopiaDomainName}/`}>Profile Editor</a>
      </li>
      <li className="menu nav-item">
        <a href="#" className="help-resources nav-link" onClick={props.triggerHomePageMenu}>Help and Resources</a>
      </li>
      {props.currentUser && props.currentSession
          && <li className="nav-item">
            <a href="#" className="nav-link editor-header-logout"
               onClick={() => CognitoUtils.handleSignout(props.currentUser, props.signedOut)}>Logout</a>
          </li>
      }
    </ul>
  </div>
)

Header.propTypes = {
  triggerHomePageMenu: PropTypes.func,
  currentUser: PropTypes.object,
  currentSession: PropTypes.object,
  signedOut: PropTypes.func,
}

const mapStateToProps = (state) => ({
  currentUser: selectCurrentUser(state),
  currentSession: selectCurrentSession(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ signedOut }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
