import React, { Component } from 'react'
import SinopiaLogo from '../styles/sinopia-logo.png'
import { Link } from 'react-router-dom'

class Header extends Component {
  render() {
    return (
      <div className="navbar homepage-navbar">
        <div className="navbar-header">
          <a className="navbar-brand" href="https://google.com">
            <img src={SinopiaLogo} height="55px" />
          </a>
        </div>
        <ul className= "nav navbar-nav pull-right">
          <li>
            <Link to='/editor'> BFF (Bib Editor) </Link>
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

export default Header
