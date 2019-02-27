// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropertyRemark from './PropertyRemark'
import RequiredSuperscript from './RequiredSuperscript'

export default class PropertyPanel extends Component {

  constructor(props) {
    super(props)
    // this.generateTitle = this.generateTitle.bind(this)
  }

  generateTitle = () => {
    let title
    if (this.props.pt.remark) {
      title = <PropertyRemark remark={this.props.pt.remark}
        label={this.props.pt.propertyLabel} />
    } else {
      title = this.props.pt.propertyLabel
    }
    if (this.props.pt.mandatory === "true") {
      title = [title, <RequiredSuperscript />]
    }
    return title
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {this.generateTitle()}
        </div>
        <div className="panel-body">
          {this.props.children}
        </div>
      </div>
    )
  }

}
