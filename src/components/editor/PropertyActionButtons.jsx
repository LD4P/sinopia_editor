// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export class AddButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      disabled: false
    }
  }

  render() {
    return(<button className="btn btn-default btn-sm"
            onClick={this.props.onClick}
            disabled={this.state.disabled}>Add</button>)
  }
}

export class MintButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      disabled: true
    }
  }

  render() {
    return(<button onClick={this.props.onClick}
                   disabled={this.state.disabled}
                   className="btn btn-success btn-sm">Mint URI</button>)
  }
}

export class PropertyActionButtons extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<div className="btn-group" role="group" aria-label="...">
      <MintButton onClick={this.props.handleMintUri} />
      <AddButton onClick={this.props.handleAddClick} />
    </div>)
  }
}

AddButton.propTypes = {
  onClick: PropTypes.func
}

MintButton.propTypes = {
  onClick: PropTypes.func
}

PropertyActionButtons.propTypes = {
  handleAddClick: PropTypes.func,
  handleMintUri: PropTypes.func
}

export default PropertyActionButtons;
