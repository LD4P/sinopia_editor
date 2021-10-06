// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { NavLink, useLocation } from "react-router-dom"
import Config from "Config"
import { connect } from "react-redux"
import { selectUser } from "selectors/authenticate"
import { signOut } from "actionCreators/authenticate"
import { bindActionCreators } from "redux"
import { selectCurrentResourceKey } from "selectors/resources"
import { selectAppVersion } from "selectors/index"
import usePermissions from "hooks/usePermissions"

const Header = (props) => {
  const { canCreate } = usePermissions()
  const location = useLocation()
  const isActionsActive =
    location.pathname === "/exports" || location.pathname === "/load"
  return (
    <React.Fragment>
      <div className="editor-navbar">
        <div className="row">
          <div className="col-6">
            <h1 className="editor-logo">Sinopia{`${Config.sinopiaEnv}`}</h1>
          </div>
          <div className="col-6">
            <ul className="nav pull-right">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <span className="editor-subtitle">SINOPIA</span>{" "}
                  <span className="editor-version">v{props.version}</span>
                </a>
              </li>
              {props.currentUser && (
                <li className="nav-item">
                  <span className="nav-link editor-header-user">
                    {props.currentUser.username}
                  </span>
                </li>
              )}
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link editor-help-resources"
                  onClick={props.triggerEditorMenu}
                >
                  Help and Resources
                </a>
              </li>
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
        </div>
      </div>

      <ul className="nav editor-navtabs">
        {/* Navlinks enable highlighting the appropriate tab based on route, active style is defined in css */}
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        {props.hasResource && canCreate && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/editor">
              Editor
            </NavLink>
          </li>
        )}
        <li className="nav-item">
          <NavLink className="nav-link" to="/templates">
            Resource Templates
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/search">
            Search
          </NavLink>
        </li>

        <li className="nav-item dropdown">
          <a
            className={`nav-link dropdown-toggle ${
              isActionsActive && "active"
            }`}
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-expanded="false"
          >
            Actions
          </a>
          <ul className="dropdown-menu">
            {canCreate && (
              <li>
                <NavLink className="dropdown-item" to="/load">
                  Load RDF
                </NavLink>
              </li>
            )}
            <li>
              <NavLink className="dropdown-item" to="/exports">
                Exports
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </React.Fragment>
  )
}

Header.propTypes = {
  triggerEditorMenu: PropTypes.func,
  version: PropTypes.string,
  hasResource: PropTypes.bool,
  currentUser: PropTypes.object,
  signOut: PropTypes.func,
}

const mapStateToProps = (state) => ({
  currentUser: selectUser(state),
  hasResource: !!selectCurrentResourceKey(state),
  version: selectAppVersion(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ signOut }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
