// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import FormWrapper from './FormWrapper'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')

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
    let resourceTemplate = getResourceTemplate(this.props.resourceTemplateId)
    return (
      <div className='ResourceTemplate' style={Object.assign(dashedBorder, float)}>
        <h3>Resource Template Container </h3>
        <p>Resource Template selected:</p>
        <ul>
          <li>resourceLabel: <strong>{resourceTemplate.resourceLabel}</strong></li>
          <li>resourceURI: <strong>{resourceTemplate.resourceURI}</strong></li>
          <li>id: <strong>{this.props.resourceTemplateId}</strong></li>
          <li>remark: <strong>{resourceTemplate.remark}</strong></li>
        </ul>
        <div id="resourceTemplate">
          <h4>BEGINNING OF FORM</h4>
          <FormWrapper propertyTemplates = {[resourceTemplate.propertyTemplates]} />
          <h4>END OF FORM</h4>
        </div>
      </div>
    )
  }
}

export default ResourceTemplate;
