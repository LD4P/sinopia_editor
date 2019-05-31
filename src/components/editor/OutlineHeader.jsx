// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import PropertyLabel from './PropertyLabel'

class OutlineHeader extends Component {
  constructor(props) {
    super(props)
  }

  isCollapsed = () => {
    if (this.props.collapsed == true) {
      return faPlusSquare
    }

    return faMinusSquare
  }

  spacer = () => {
    let unicode_spacer = ''

    for (let i = 0; i <= this.props.spacer; i++) {
      unicode_spacer += '\u00a0'
    }

    return unicode_spacer
  }

  render() {
    return (
      <div className="rOutline-header">
        {this.spacer()}
        <a href="#" onClick={this.props.handleCollapsed} data-id={this.props.id}>
          <FontAwesomeIcon icon={this.isCollapsed()} />&nbsp;
        </a>
        <PropertyLabel pt={this.props.pt} />
      </div>
    )
  }
}

OutlineHeader.propTypes = {
  collapsed: PropTypes.any,
  handleCollapsed: PropTypes.func,
  id: PropTypes.string,
  isRequired: PropTypes.any,
  pt: PropTypes.object,
  spacer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default OutlineHeader
