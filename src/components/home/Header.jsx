// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import Config from "Config"
import { connect } from "react-redux"
import { selectUser } from "selectors/authenticate"
import { signOut } from "actionCreators/authenticate"
import { bindActionCreators } from "redux"

const Header = (props) => (
  <div className="navbar homepage-navbar">
    <div className="navbar-header">
      <a className="navbar-brand" href={`${Config.sinopiaUrl}`}>
        <h1 className="editor-logo"> Sinopia{`${Config.sinopiaEnv}`}</h1>
      </a>
    </div>
    <ul className="nav">
      {props.currentUser && (
        <React.Fragment>
          <li className="nav-item">
            <span className="nav-link editor-header-user">
              {props.currentUser.username}
            </span>
          </li>
          <div className="nav-link">•</div>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              Linked Data Editor
            </Link>
          </li>
        </React.Fragment>
      )}
      {props.currentUser && <div className="nav-link">•</div>}
      <li className="menu nav-item">
        <a
          href="#"
          className="help-resources nav-link"
          onClick={props.triggerHomePageMenu}
        >
          Help
        </a>
      </li>
      {props.currentUser && <div className="nav-link">•</div>}
      {props.currentUser && (
        <li className="nav-item">
          <a
            href="#"
            className="nav-link editor-header-logout"
            onClick={() => props.signOut()}
          >
            Logout
          </a>
        </li>
      )}
    </ul>
  </div>
)

Header.propTypes = {
  triggerHomePageMenu: PropTypes.func,
  currentUser: PropTypes.object,
  signOut: PropTypes.func,
}

const mapStateToProps = (state) => ({
  currentUser: selectUser(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ signOut }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
