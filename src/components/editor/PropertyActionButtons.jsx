// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class AddButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <button className="btn btn-default btn-sm"
              onClick={this.props.onClick}
              disabled={this.props.isDisabled}>Add</button>
    )
  }
}

export class PropertyActionButtons extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div className="btn-group" role="group" aria-label="...">
      <AddButton onClick={this.props.handleAddClick} isDisabled={this.props.addButtonDisabled}/>
    </div>)
  }
}

PropertyActionButtons.propTypes = {
  addButtonDisabled: PropTypes.bool,
  handleAddClick: PropTypes.func,
}

AddButton.propTypes = {
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  reduxPath: PropTypes.array,
}

export default PropertyActionButtons
