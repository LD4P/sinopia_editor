// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react';

class InputLiteral extends Component {
  render() {
    return (
      <div className="form-group">
        <label>{this.props.propertyTemplate.propertyLabel}</label>
        <input className="form-control" required = { this.props.propertyTemplate.mandatory? true : null} type="text" placeholder={this.props.propertyTemplate.propertyLabel}/>
      </div>
    )
  }
}

export default InputLiteral;