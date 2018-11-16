// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import FormWrapper from './FormWrapper'

class ResourceTemplate extends Component {

  render () {
    let dashedBorder = {
      border: '1px dashed',
      padding: '10px',
    }
    let float = {
      float: 'left',
      width:'75%'
    }
    return (
      <div className='ResourceTemplate' style={Object.assign(dashedBorder, float)}>
        <h3>Resource Template Container </h3>
        <p>Resource Template selected:</p>
        <ul>
          <li>resourceLabel: <strong>{this.props.resourceTemplates[0].resourceLabel}</strong></li>
          <li>resourceURI: <strong>{this.props.resourceTemplates[0].resourceURI}</strong></li>
          <li>id: <strong>{this.props.resourceTemplates[0].id}</strong></li>
          <li>remark: <strong>{this.props.resourceTemplates[0].remark}</strong></li>
        </ul>
        <div id="resourceTemplate">
          <h4>BEGINNING OF FORM</h4>
          <FormWrapper propertyTemplates = {[this.props.resourceTemplates[0].propertyTemplates]} />
          <h4>END OF FORM</h4>
        </div>
      </div>
    )
  }
}

export default ResourceTemplate;
