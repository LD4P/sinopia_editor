// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export class AddButton extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<button className="btn btn-default btn-sm"
            onClick={this.props.onClick}
            disabled={this.props.isDisabled}>Add</button>)
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
      <AddButton onClick={this.props.handleAddClick} isDisabled={this.props.addButtonDisabled}/>
    </div>)
  }
}

MintButton.propTypes = {
  onClick: PropTypes.func
}

PropertyActionButtons.propTypes = {
  addButtonDisabled: PropTypes.bool,
  handleAddClick: PropTypes.func,
  handleMintUri: PropTypes.func
}

AddButton.propTypes = {
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  reduxPath: PropTypes.array
}

export default PropertyActionButtons;
