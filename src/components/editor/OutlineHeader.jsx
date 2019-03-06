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
    let unicode_spacer = ""
    for(var i=0; i <= this.props.spacer; i++) {
      unicode_spacer += "\u00a0"
    }
    return(unicode_spacer)
  }

  render() {
    return(
      <div className="rOutline-header">
          {this.spacer()}
          <a href="#" onClick={this.props.handleCollapsed}>
            <FontAwesomeIcon icon={this.isCollapsed()} />&nbsp;
          </a>
          {this.props.label}
          {this.props.isRequired}
      </div>)
  }
}

OutlineHeader.propTypes = {
  collapsed: PropTypes.boolean,
  handleCollapsed: PropTypes.func,
  // isCollapsed: PropTypes.func,
  isRequired: PropTypes.func,
  label: PropTypes.string,
  spacer: PropTypes.string
}

export default OutlineHeader;
