// Copyright 2019 Stanford University see Apache2.txt for license
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export class PropertyRemark extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    try {
      const url = new URL(this.props.remark)
      return <a href={url} className="prop-remark" alt={this.props.remark}>
              <span className="prop-remark">{this.props.label}</span>
             </a>

    } catch (_) {
      return this.props.label
    }
  }

}

PropertyRemark.propTypes = {
  label: PropTypes.string.isRequired,
  remark: PropTypes.string.isRequired
}
export default PropertyRemark;
