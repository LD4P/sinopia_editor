// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropertyRemark from './PropertyRemark'
import RequiredSuperscript from './RequiredSuperscript'

export default class PropertyPanel extends Component {

  constructor(props) {
    super(props)

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

  getCssClasses = () => {
    let floatClass = 'pull-left'
    if (this.props.float > 0) {
      if(this.props.float%0 > 0) {
        floatClass = 'pull-right'
      }
    }
    return `panel panel-property ${floatClass}`
  }

  render() {
    return (
      <div className={this.getCssClasses()}>
        <div className="panel-heading prop-heading">
          {this.generateTitle()}
        </div>
        <div className="panel-body">
          {this.props.children}
        </div>
      </div>
    )
  }

}
