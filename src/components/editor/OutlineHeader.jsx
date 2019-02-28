// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

class OutlineHeader extends Component {

  constructor(props) {
    super(props)
  }

  isCollapsed = () => {
    if(this.props.collapsed == true) {
      return faPlusSquare
    }
    return faMinusSquare
  }

  spacer = () => {
    let nbspList
    return(nbspList)
  }

  render() {
    return(
      <div className="rOutline-header">
          <a href="#" onClick={this.props.handleCollapsed}>
            {this.spacer()}
            <FontAwesomeIcon icon={this.isCollapsed()} />&nbsp;
          </a>
          {this.props.label}
          {this.props.isRequired}
      </div>)
  }
}

export default OutlineHeader;
