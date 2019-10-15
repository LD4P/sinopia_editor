// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'
import InputLiteral from './InputLiteral'
import InputURI from './InputURI'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import InputLookupSinopia from './InputLookupSinopia'
import Alert from '../../Alert'

const PropertyComponent = (props) => {
  let tag
  let message

  try {
    tag = getTagNameForPropertyTemplate(props.propertyTemplate)
  } catch (errorMessage) {
    // If we have a better error message, use it.
    message = errorMessage
  }

  // Might be tempted to use lazy / suspense here, but it forces a remounting of components.
  switch (tag) {
    case 'InputLiteral':
      return (
        <InputLiteral reduxPath={props.reduxPath} />
      )
    case 'InputURI':
      return (
        <InputURI reduxPath={props.reduxPath} />
      )
    case 'InputLookupQA':
      return (
        <InputLookupQA reduxPath={props.reduxPath} />
      )
    case 'InputLookupSinopia':
      return (
        <InputLookupSinopia reduxPath={props.reduxPath} />
      )
    case 'InputListLOC':
      return (
        <InputListLOC reduxPath={props.reduxPath} />
      )
    default:
      return (
        <Alert text={message} />
      )
  }
}

PropertyComponent.propTypes = {
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.array.isRequired,
}

export default PropertyComponent
