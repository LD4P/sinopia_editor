// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import ResourceTemplateForm from './ResourceTemplateForm'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')
import PropTypes from 'prop-types'

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
          <h4>BEGIN ResourceTemplate</h4>
          <ResourceTemplateForm propertyTemplates = {resourceTemplate.propertyTemplates} />
          <h4>END ResourceTemplate</h4>
        </div>
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  resourceTemplateId: PropTypes.string
}

export default ResourceTemplate;
