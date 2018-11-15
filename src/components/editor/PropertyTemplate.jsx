import React, { Component } from 'react'
import ValueConstraints from './ValueConstraints'

class PropertyTemplate extends Component {
  render() {
    let dottedBorder = {
      border: '1px dotted',
      padding: '10px'
    }
    if (this.props.propertyTemplates.length == 0) {
      return <h1>We should have propertyTemplates but we don't.</h1>
    } else if (this.props.propertyTemplates[0].resourceTemplates == undefined ) {
      return <h1>We should have propertyTemplate contents but we don't.</h1>
    } else {
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
}


export default PropertyTemplate
