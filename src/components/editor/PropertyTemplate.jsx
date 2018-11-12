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
import React, { Component } from 'react'
import ValueConstraints from './ValueConstraints'

class PropertyTemplate extends Component {
  render() {
    let dottedBorder = {
      border: '1px dotted',
      padding: '10px'
    }
    return (
      <div className='PropertyTemplate' style={dottedBorder}>
        <h5>BEGIN PropertyTemplate elements</h5>
        <ul>
          <li>propertyLabel: <strong>{this.props.propertyTemplates[0].propertyLabel}</strong></li>
          <li>propertyURI: <strong>{this.props.propertyTemplates[0].propertyURI}</strong></li>
          <li>type: <strong>{this.props.propertyTemplates[0].type}</strong></li>
          <li>mandatory: <strong>{this.props.propertyTemplates[0].mandatory}</strong></li>
          <li>repeatable: <strong>{this.props.propertyTemplates[0].repeatable}</strong></li>
          <li>contained resourceTemplates[] length: <strong>{this.props.propertyTemplates[0].resourceTemplates.length}</strong></li>
          <li>
            <ValueConstraints {...this.props.propertyTemplates[0].valueConstraint} />
          </li>
        </ul>
        <h5>END of PropertyTemplate elements</h5>
      </div>
    )
  }
}


export default PropertyTemplate
