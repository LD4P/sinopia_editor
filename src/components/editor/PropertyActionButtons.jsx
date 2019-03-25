// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export class PropertyActionButtons extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<div className="btn-group" role="group" aria-label="...">
      <button onClick={this.props.handleMintUri} className="btn btn-success btn-sm">Mint URI</button>
      <button className="btn btn-default btn-sm" onClick={this.props.handleAddClick}>Add</button>
    </div>)
  }
}

PropertyActionButtons.propTypes = {
  handleAddClick: PropTypes.func,
  handleMintUri: PropTypes.func
}

export default PropertyActionButtons;
