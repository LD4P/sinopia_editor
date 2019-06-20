// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SinopiaLogo from '../../img/sinopia-logo.png'
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
        <ul className= "nav navbar-nav pull-right">
          <li>
            <Link to="/templates">Linked Data Editor</Link>
          </li>
          <li>
            <a className="header-text" href={`https://profile-editor.${Config.sinopiaDomainName}/`}>Profile Editor</a>
          </li>
          <li className="menu">
            <a href="#" className="help-resources" onClick={this.props.triggerHomePageMenu}>Help and Resources</a>
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
