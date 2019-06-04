// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shortid from 'shortid'

/**
 * Represents a single input field. E.g. "Prefered title for work"
 */
export class PropertyTypeRow extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment key={shortid.generate()}>
        { this.props.children }
      </React.Fragment>
    )
  }
}

PropertyTypeRow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  handleAddClick: PropTypes.func,
  propertyTemplate: PropTypes.object,
}

export default PropertyTypeRow
