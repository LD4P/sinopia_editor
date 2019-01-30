// Copyright 2019 Stanford University see Apache2.txt for license
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export class PropertyRemark extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (<a href={this.props.remark} className="prop-remark">
           <span className="prop-remark">{this.props.label}</span>
        </a>)
  }
}

PropertyRemark.propTypes = {
  label: PropTypes.string.isRequired,
  remark: PropTypes.string.isRequired
}
export default PropertyRemark;
