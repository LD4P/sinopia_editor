// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import InputLiteral from './InputLiteral'
import InputURI from './InputURI'
import InputList from './InputList'
import InputLookupQA from './InputLookupQA'
import InputLookupSinopia from './InputLookupSinopia'
import NestedResource from './NestedResource'
import Alert from '../../Alert'

// Decides how to render this property.
const PropertyComponent = (props) => {
  // Might be tempted to use lazy / suspense here, but it forces a remounting of components.
  switch (props.propertyTemplate.component) {
    case 'NestedResource':
      return props.property.valueKeys.map((valueKey) => (
        <NestedResource key={valueKey} valueKey={valueKey} />
      ))
    case 'InputLiteral':
      return (
        <InputLiteral property={props.property} propertyTemplate={props.propertyTemplate} />
      )
    case 'InputURI':
      return (
        <InputURI property={props.property} propertyTemplate={props.propertyTemplate} />
      )
    case 'InputLookupQA':
      return (
        <InputLookupQA property={props.property} propertyTemplate={props.propertyTemplate} />
      )
    case 'InputLookupSinopia':
      return (
        <InputLookupSinopia property={props.property} propertyTemplate={props.propertyTemplate} />
      )
    case 'InputList':
      return (
        <InputList property={props.property} propertyTemplate={props.propertyTemplate} />
      )
    default:
      return (
        <Alert text="No component." />
      )
  }
}

PropertyComponent.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
}

export default PropertyComponent
