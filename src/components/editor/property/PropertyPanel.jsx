// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PropertyLabel from './PropertyLabel'

export default class PropertyPanel extends Component {
  constructor(props) {
    super(props)
  }

  getCssClasses = () => {
    let floatClass = 'pull-left'

    if (this.props.float > 0) {
      if (this.props.float % 0 > 0) {
        floatClass = 'pull-right'
      }
    }

    return `panel panel-property ${floatClass}`
  }

  render() {
    return (
      <div className={this.getCssClasses()} propLabel={this.props.pt.propertyLabel}>
        <div className="panel-heading prop-heading">
          <PropertyLabel pt={this.props.pt} />
        </div>
        <div className="panel-body">
          {this.props.children}
        </div>
      </div>
    )
  }
}

PropertyPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  float: PropTypes.number,
  pt: PropTypes.object,
}
