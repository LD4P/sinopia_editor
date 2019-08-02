// Copyright 2019 Stanford University see LICENSE for license
/* This seems to be throwing false positives */
/* eslint react/prop-types: 'off' */

import React from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import InputLookupSinopia from './InputLookupSinopia'
import InputURI from './InputURI'
import { getLookupConfigItems } from 'Utilities'

const PropertyComponent = (props) => {
  let config

  // We do not support mixed list and lookups, so we will just go with the value of the first config item found
  try {
    config = getLookupConfigItems(props.propertyTemplate)[0].component
  } catch {
    // Ignore undefined configuration
  }

  const textFieldType = (config) => {
    const propertyTemplate = props.propertyTemplate

    switch (propertyTemplate.type) {
      case 'literal':
        return (<InputLiteral reduxPath={props.reduxPath} />)
      case 'resource':
        return (<InputURI reduxPath={props.reduxPath} />)
      default:
        console.error(`Unknown propertyTemplate type (component=${config}, type=${propertyTemplate.type})`)
        return null
    }
  }

  switch (config) {
    case 'local-lookup':
      return (<InputLookupSinopia reduxPath={props.reduxPath} />)
    case 'lookup':
      return (<InputLookupQA reduxPath={props.reduxPath} />)
    case 'list':
      return (<InputListLOC reduxPath={props.reduxPath} />)
    default:
      return textFieldType(config)
  }
}

PropertyComponent.propTypes = {
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.array.isRequired,
}

export default PropertyComponent
