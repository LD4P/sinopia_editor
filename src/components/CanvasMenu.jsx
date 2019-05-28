// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes  } from '@fortawesome/free-solid-svg-icons'
import Config from '../../src/Config'
import PropTypes from 'prop-types'

class CanvasMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    fetch(Config.sinopiaHelpAndResourcesMenuContent)
      .then(response => response.text())
      .then(data => this.setState({ content: data }))
  }

  render() {
    return(
      <div>
        <a href="#" onClick={this.props.closeHandleMenu}>
          <FontAwesomeIcon className="close-icon" icon={faTimes} />
        </a>

        <div dangerouslySetInnerHTML={{__html: this.state.content}} />

      </div>
    );
  };
};

CanvasMenu.propTypes = {
  closeHandleMenu: PropTypes.func
}

export default CanvasMenu;
