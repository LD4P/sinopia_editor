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
    if (this.props.collapsed === true) {
      return faPlusSquare
    }

    return faMinusSquare
  }

  spacer = () => {
    let unicodeSpacer = ''

    for (let i = 0; i <= this.props.spacer; i++) {
      unicodeSpacer += '\u00a0'
    }

    return unicodeSpacer
  }

  render() {
    if (this.props.isAdd) {
      return (
        <div className="rOutline-header">
          {this.spacer()}
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={this.props.handleCollapsed} data-id={this.props.id}>
            <FontAwesomeIcon icon={this.isCollapsed()} />&nbsp;Add
          </button>
          <PropertyLabel pt={this.props.pt} />
        </div>
      )
    }
    return (
      <div className="rOutline-header">
        {this.spacer()}
        <a href="#" type="button" onClick={this.props.handleCollapsed} data-id={this.props.id}>
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
  isAdd: PropTypes.bool,
  pt: PropTypes.object,
  spacer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default OutlineHeader
