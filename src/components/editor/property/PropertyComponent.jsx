// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import InputLiteral from './InputLiteral'
import InputURI from './InputURI'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import InputLookupSinopia from './InputLookupSinopia'
import NestedResource from './NestedResource'
import Alert from '../../Alert'

// Decides how to render this property.
const PropertyComponent = (props) => {
  // Might be tempted to use lazy / suspense here, but it forces a remounting of components.
  switch (props.property.propertyTemplate.component) {
    case 'NestedResource':
      return props.property.values.map((value) => (
        <NestedResource key={value.key} valueKey={value.key} />
      ))
    case 'InputLiteral':
      return (
        <InputLiteral property={props.property} />
      )
    case 'InputURI':
      return (
        <InputURI property={props.property} />
      )
    case 'InputLookupQA':
      return (
        <InputLookupQA property={props.property} />
      )
    case 'InputLookupSinopia':
      return (
        <InputLookupSinopia property={props.property} />
      )
    case 'InputListLOC':
      return (
        <InputListLOC property={props.property} />
      )
    default:
      return (
        <Alert text="No component." />
      )
  }
}

PropertyComponent.propTypes = {
  property: PropTypes.object.isRequired,
}

export default PropertyComponent
