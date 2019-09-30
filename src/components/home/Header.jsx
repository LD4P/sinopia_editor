// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SinopiaLogo from 'styles/sinopia-logo.png'
import Config from 'Config'

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
          <li className="nav-item">
            <Link to="/templates" className="nav-link">Linked Data Editor</Link>
          </li>
          <li className="nav-item">
            <a className="header-text nav-link" href={`https://profile-editor.${Config.sinopiaDomainName}/`}>Profile Editor</a>
          </li>
          <li className="menu nav-item">
            <a href="#" className="help-resources nav-link" onClick={this.props.triggerHomePageMenu}>Help and Resources</a>
          </li>
        </ul>
      </div>
    )
  }
}

Header.propTypes = {
  triggerHomePageMenu: PropTypes.func,
}

export default Header
