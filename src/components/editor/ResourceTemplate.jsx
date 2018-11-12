/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
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

    return (
      <div className='ResourceTemplate' style={dashedBorder}>
        <h3>Resource Template Container </h3>
        <p>Resource Template selected:</p>
        <ul>
          <li>resourceLabel: <strong>{this.props.resourceTemplates[0].resourceLabel}</strong></li>
          <li>resourceURI: <strong>{this.props.resourceTemplates[0].resourceURI}</strong></li>
          <li>id: <strong>{this.props.resourceTemplates[0].id}</strong></li>
          <li>remark: <strong>{this.props.resourceTemplates[0].remark}</strong></li>
        </ul>
        <form id="resourceTemplate" className="form-horizontal" role="form" style={dottedBorder}>
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

export default ResourceTemplate;
