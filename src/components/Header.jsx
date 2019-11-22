// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Config from 'Config'
import CognitoUtils from '../CognitoUtils'
import { connect } from 'react-redux'
import { hasResource as hasResourceSelector } from 'selectors/resourceSelectors'
import { getCurrentUser } from 'authSelectors'
import { signedOut } from 'actionCreators/authenticate'
import { bindActionCreators } from 'redux'

class Header extends Component {
  hidePopovers() {
    if (window.$('.popover').popover) {
      window.$('.popover').popover('hide')
    }
  }

  render() {
    return (
      <div className="editor-navbar">
        <div className="row">
          <div className="col-6">
            <h1 className="editor-logo Display5">LINKED DATA EDITOR{`${Config.sinopiaEnv}`}</h1>
          </div>
          <div className="col-6">
            <ul className="nav pull-right">
              <li className="nav-item">
                <a className="nav-link" href="/"><span className="editor-subtitle">SINOPIA</span> <span className="editor-version">v{this.props.version}</span></a>
              </li>
              {this.props.currentUser
                && <li className="nav-item">
                  <span className="nav-link editor-header-user">{this.props.currentUser.username}</span>
                </li>
              }
              <li className="nav-item">
                <a className="nav-link editor-header-text" href={`https://profile-editor.${Config.sinopiaDomainName}/`}>Profile Editor</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link editor-help-resources" onClick={this.props.triggerEditorMenu}>Help and Resources</a>
              </li>
              {this.props.currentUser
                && <li className="nav-item">
                  <a href="#" className="nav-link editor-header-logout"
                     onClick={() => CognitoUtils.handleSignout(this.props.currentUser, this.props.signedOut)}>Logout</a>
                </li>
              }
            </ul>
          </div>
        </div>
        <ul className="nav nav-tabs editor-navtabs">
          { /* Navlinks enable highlighting the appropriate tab based on route, active style is defined in css */}
          <li className="nav-item"><NavLink onClick={this.hidePopovers} className="nav-link" to="/templates">Resource Templates</NavLink></li>
          <li className="nav-item"><NavLink onClick={this.hidePopovers} className="nav-link" to="/search">Search</NavLink></li>
          <li className="nav-item"><NavLink onClick={this.hidePopovers} className="nav-link" to="/load">Load RDF</NavLink></li>
          { this.props.hasResource
           && <li className="nav-item"><NavLink onClick={this.hidePopovers} className="nav-link" to="/editor">Editor</NavLink></li>
          }
          <li className="nav-item"><NavLink onClick={this.hidePopovers} className="nav-link" to="/exports">Exports</NavLink></li>
        </ul>
      </div>
    )
  }
}

Header.propTypes = {
  triggerEditorMenu: PropTypes.func,
  version: PropTypes.string,
  hasResource: PropTypes.bool,
  currentUser: PropTypes.object,
  signedOut: PropTypes.func,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  hasResource: hasResourceSelector(state),
  version: state.selectorReducer.appVersion.version,
})

const mapDispatchToProps = dispatch => bindActionCreators({ signedOut }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
