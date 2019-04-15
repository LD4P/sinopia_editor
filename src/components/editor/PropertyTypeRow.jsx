// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import shortid from 'shortid'

export class PropertyTypeRow extends Component {

  constructor (props) {
    super(props)
  }

  render() {
    return(
      <React.Fragment key={shortid.generate()}>
      { this.props.children }
      </React.Fragment>
    )
  }
}

PropertyTypeRow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  handleAddClick: PropTypes.func,
  handleMintUri: PropTypes.func,
  propertyTemplate: PropTypes.object,
}

export default PropertyTypeRow;
