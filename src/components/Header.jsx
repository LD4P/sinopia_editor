/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
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
