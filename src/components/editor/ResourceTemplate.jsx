// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import PropertyTemplate from './PropertyTemplate'

class ResourceTemplate extends Component {

  render () {
    let dashedBorder = {
      border: '1px dashed',
      padding: '10px',
    }
    let dottedBorder = {
      border: '1px dotted',
      padding: '10px'
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
        <form id="resourceTemplate" className="form-horizontal" style={dottedBorder}>
          <h4>BEGINNING OF FORM</h4>
          <PropertiesWrapper propertyTemplates = {[this.props.resourceTemplates[0].propertyTemplates]} />
          <h4>END OF FORM</h4>
        </form>
      </div>
    )
  }
}

class PropertiesWrapper extends Component{
  render () {
    let dashedBorder = {
      border: '1px dashed',
      padding: '10px',
    }
    if (this.props.propertyTemplates.length == 0 || this.props.propertyTemplates[0] == {}) {
      return <h3 color="red">There are no propertyTemplates - probably an error.</h3>
    } else {
      return (
        <div className='PropertiesWrapper' style={dashedBorder}>
          <p>BEGIN PropertiesWrapper</p>
            <div>
              {this.props.propertyTemplates[0].map(function(pt, index){
                return <PropertyTemplate key={index} propertyTemplates={[pt]}/>
              })}
            </div>
          <p>END PropertiesWrapper</p>
        </div>
      )
    }
  }
}

export default ResourceTemplate;
