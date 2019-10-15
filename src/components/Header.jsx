// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Config from 'Config'
import { connect } from 'react-redux'
import _ from 'lodash'

class Header extends Component {
  render() {
    return (
      <div className="editor-navbar">
        <div className="row">
          <div className="col-8">
            <h2 className="editor-subtitle"><a className="editor-subtitle" href="/">SINOPIA</a></h2> <h2 className="editor-version">v{this.props.version}</h2>
            <h1 className="editor-logo">LINKED DATA EDITOR{`${Config.sinopiaEnv}`}</h1>
          </div>
          <div className="col-4">
            <ul className="nav pull-right">
              <li className="nav-item">
                <a className="nav-link editor-header-text" href={`https://profile-editor.${Config.sinopiaDomainName}/`}>Profile Editor</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link editor-help-resources" onClick={this.props.triggerEditorMenu}>Help and Resources</a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <ul className="nav nav-tabs pull-left editor-navtabs">
            { /* Navlinks enable highlighting the appropriate tab based on route, active style is defined in css */}
            <li className="nav-item"><NavLink className="nav-link" to="/search">Search</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/templates">Resource Templates</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/load">Load RDF</NavLink></li>
            { this.props.hasResource
             && <li className="nav-item"><NavLink className="nav-link" to="/editor">Editor</NavLink></li>
            }
          </ul>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  triggerEditorMenu: PropTypes.func,
  version: PropTypes.string,
  hasResource: PropTypes.bool,
}

const mapStateToProps = (state) => {
  const hasResource = !_.isEmpty(state.selectorReducer.resource)
  return {
    version: state.selectorReducer.appVersion.version,
    hasResource,
  }
}

export default connect(mapStateToProps)(Header)
