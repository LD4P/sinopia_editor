// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export class PropertyTypeRow extends Component {

  constructor (props) {
    super(props)
  }

  render() {
    return(<div className="row" >
      <section className="col-sm-4">
        {this.props.propertyTemplate.propertyLabel}
      </section>
      <section className="col-sm-8">
        { this.props.children }
      </section>
    </div>)
  }
}

export default PropertyTypeRow;
