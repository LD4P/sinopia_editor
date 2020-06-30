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
import { selectProperty } from 'selectors/resources'
import { connect } from 'react-redux'

// Decides how to render this property.
const PropertyComponent = (props) => {
  if (props.property.propertyTemplate.type === 'resource') {
    return props.property.values.map((value) => (
      <NestedResource key={value.key} valueKey={value.key} />
    ))
  }
  // Might be tempted to use lazy / suspense here, but it forces a remounting of components.
  switch (props.property.propertyTemplate.component) {
    case 'InputLiteral':
      return (
        <InputLiteral propertyKey={props.propertyKey} />
      )
    case 'InputURI':
      return (
        <InputURI propertyKey={props.propertyKey} />
      )
    case 'InputLookupQA':
      return (
        <InputLookupQA propertyKey={props.propertyKey} />
      )
    case 'InputLookupSinopia':
      return (
        <InputLookupSinopia propertyKey={props.propertyKey} />
      )
    case 'InputListLOC':
      return (
        <InputListLOC propertyKey={props.propertyKey} />
      )
    default:
      return (
        <Alert text="No component." />
      )
  }
}

PropertyComponent.propTypes = {
  propertyKey: PropTypes.string,
  property: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => ({
  property: selectProperty(state, ourProps.propertyKey),
})

export default connect(mapStateToProps)(PropertyComponent)
