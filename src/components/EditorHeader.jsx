import React, { Component } from 'react'
import SinopiaLogo from '../styles/editorsinopialogo.png'
import { Link } from 'react-router-dom'

class EditorHeader extends Component {
  render() {
    return (
      <div className="navbar editor-navbar">
        <div className="navbar-header">
          <a className="editor-navbar-brand" href="https://google.com">
            <img id="sinopia-editor" src={SinopiaLogo} height="55px" />
          </a>
        </div>
        <ul className= "nav navbar-nav pull-right">
          <li>
             <a className="editor-header-text" href="https://google.com">astridu</a>
          </li>
          <li>
            <a className="editor-header-text" href="https://google.com">Profile Editor</a>
          </li>
          <li className="menu">
            <a href="#" className="editor-help-resources" onClick={this.props.triggerEditorMenu}>Help and Resources</a>
          </li>
          <li>
             <a className="editor-header-text" href="https://google.com">Logout</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default EditorHeader