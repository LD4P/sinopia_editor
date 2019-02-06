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

    var resourceTemplateData = (rtd) => {
      let result
      if (rtd == undefined) {
        // e.g. at startup
        result = [getResourceTemplate(this.props.resourceTemplateId)]
      }
      else {
        if (typeof rtd == 'object') {
          // Enable us to  use profiles or resourceTemplate
          if (rtd.propertyTemplates){
            result = [rtd]
          }
          else if (rtd.Profile) {
            // TODO:  if we allow profiles to be "imported" into BFF,
            //  ask user which resourceTemplate they want?
            result = rtd.Profile.resourceTemplates
          }
        }
      }
      return result
    }

    let rtData = resourceTemplateData(this.props.resourceTemplateData)

    return (
      <div>
        {rtData.map((rt, index) => {
          return(
            <div className='ResourceTemplate' style={Object.assign(dashedBorder, float)} key={index}>
              <h4>Resource Template Container </h4>
              <p>Resource Template selected:</p>
              <ul>
                <li>resourceLabel: <strong>{rt.resourceLabel}</strong></li>
                <li>resourceURI: <strong>{rt.resourceURI}</strong></li>
                <li>id: <strong>{rt.id}</strong></li>
                <li>remark: <strong>{rt.remark}</strong></li>
              </ul>
              <div id="resourceTemplate">
                <h4>BEGIN ResourceTemplate</h4>
                  <ResourceTemplateForm
                    propertyTemplates = {rt.propertyTemplates}
                    resourceTemplate = {rt}
                    parentResourceTemplate = {this.props.resourceTemplateId}
                    rtId = {rt.id}
                  />
                <h4>END ResourceTemplate</h4>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  resourceTemplateId: PropTypes.string,
  resourceTemplateData: PropTypes.object
}

export default  ResourceTemplate
