// Copyright 2018 Leland Stanford Junior University see Apache2.txt for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SinopiaLogo from '../styles/sinopia-logo.png'
import { Link } from 'react-router-dom'

class Header extends Component {
  render() {
    return (
      <div className="navbar homepage-navbar">
        <div className="navbar-header">
          <a className="navbar-brand" href="https://sinopia.io/">
            <img src={SinopiaLogo} height="55px" alt="Sinopia logo" />
          </a>
        </div>
        <ul className= "nav navbar-nav pull-right">
          <li>
            <Link to='/editor'>Linked Data Editor</Link>
          </li>
          <li>
            <a className="header-text" href="https://profile-editor.sinopia.io/">Profile Editor</a>
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
  triggerHomePageMenu: PropTypes.func
}

export default Header
