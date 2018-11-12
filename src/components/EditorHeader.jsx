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
import SinopiaLogo from '../styles/editorsinopialogo.png'
import { Link } from 'react-router-dom'

class EditorHeader extends Component {
  render() {
    return (
      <div className="navbar editor-navbar">
        <div>
          <h1 className="editor-logo"><a className="editor-navbar-brand navbar-brand" href="/">SINOPIA</a></h1>
        </div>
        <div>
          <ul className="nav navbar-nav pull-right">
            <li>
              <a className="editor-header-text" href="https://profile-editor.sinopia.io/">Profile Editor</a>
            </li>
            <li className="menu">
              <a href="#" className="editor-help-resources" onClick={this.props.triggerEditorMenu}>Help and Resources</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default EditorHeader
