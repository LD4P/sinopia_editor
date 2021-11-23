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
import usePermissions from "hooks/usePermissions"
import HeaderSearch from "./search/HeaderSearch"

const Header = (props) => {
  const { canCreate } = usePermissions()
  const location = useLocation()
  const isActionsActive =
    location.pathname === "/exports" ||
    location.pathname === "/load" ||
    location.pathname.startsWith("/metrics/")

  return (
    <React.Fragment>
      <div className="editor-navbar">
        <div className="row">
          <div className="col-6">
            <a href="/">
              <h1 className="editor-logo">Sinopia{`${Config.sinopiaEnv}`}</h1>
            </a>
          </div>
          <div className="col-6">
            <ul className="nav pull-right">
              {props.currentUser && (
                <li className="nav-item">
                  <span className="nav-link editor-header-user">
                    {props.currentUser.username}
                  </span>
                </li>
              )}
              <div className="nav-link">•</div>
              {props.currentUser && (
                <li className="nav-item">
                  <a
                    href="#"
                    className="nav-link editor-help-resources"
                    onClick={props.triggerEditorMenu}
                  >
                    Help
                  </a>
                </li>
              )}
              <div className="nav-link">•</div>
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
      <nav className="navbar navbar-expand-lg editor-navtabs">
        <ul className="navbar-nav">
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
              <li>
                <h6 className="dropdown-header">View metrics</h6>
              </li>
              <li>
                <NavLink className="dropdown-item" to="/metrics/resources">
                  Resources
                </NavLink>
              </li>
              <li>
                <NavLink className="dropdown-item" to="/metrics/templates">
                  Templates
                </NavLink>
              </li>
              <li>
                <NavLink className="dropdown-item" to="/metrics/users">
                  Users
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
        <HeaderSearch />
      </nav>
    </React.Fragment>
  )
}

Header.propTypes = {
  triggerEditorMenu: PropTypes.func,
  hasResource: PropTypes.bool,
  currentUser: PropTypes.object,
  signOut: PropTypes.func,
}

const mapStateToProps = (state) => ({
  currentUser: selectUser(state),
  hasResource: !!selectCurrentResourceKey(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ signOut }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
