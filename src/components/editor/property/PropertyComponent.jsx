// Copyright 2019 Stanford University see LICENSE for license
/* This seems to be throwing false positives */
/* eslint react/prop-types: 'off' */

import React from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
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
    const keyId = shortid.generate()

    switch (propertyTemplate.type) {
      case 'literal':
        return (<InputLiteral key={keyId} id={keyId}
                              reduxPath={props.reduxPath} />)
      case 'resource':
        return (<InputURI key={keyId} id={keyId}
                          reduxPath={props.reduxPath} />)
      default:
        console.error(`Unknown propertyTemplate type (component=${config}, type=${propertyTemplate.type})`)
        return null
    }
  }

  switch (config) {
    case 'lookup':
      return (<InputLookupQA key = {props.index}
                             reduxPath={props.reduxPath} />)
    case 'list':
      return (<InputListLOC key = {props.index}
                            reduxPath={props.reduxPath} />)
    default:
      return textFieldType(config)
  }
}

PropertyComponent.propTypes = {
  propertyTemplate: PropTypes.shape({
    type: PropTypes.string,
    propertyLabel: PropTypes.string,
    propertyURI: PropTypes.string,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }),
  }).isRequired,
  reduxPath: PropTypes.array.isRequired,
  index: PropTypes.number,
}

export default PropertyComponent
