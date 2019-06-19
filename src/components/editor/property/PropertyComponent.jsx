// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import { getLookupConfigItems } from 'Utilities'

export class PropertyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      configuration: getLookupConfigItems(this.props.propertyTemplate),
    }
  }

  inputComponentType = (property) => {
    let config

    // We do not support mixed list and lookups, so we will just go with the value of the first config item found
    try {
      config = this.state.configuration[0].component
    } catch {
      // Ignore undefined configuration
    }

    const reduxPath = Object.assign([], this.props.reduxPath)

    reduxPath.push(property.propertyURI)
    const keyId = shortid.generate()

    let defaultInput
    switch (config) {
      case 'lookup':
        return (<InputLookupQA key = {this.props.index}
                               reduxPath={reduxPath} />)
      case 'list':
        return (<InputListLOC key = {this.props.index}
                              reduxPath={reduxPath}
                              propertyTemplate = {property}
                              lookupConfig = {this.state.configuration[0]} />)
      default:
        if (property.type === 'literal') {
          defaultInput = <InputLiteral key={keyId} id={keyId} reduxPath={reduxPath} />
        } else if (property.type === 'resource') {
          defaultInput = <div className="alert alert-warning">
            This property is defined as a resource in the template but does not have references to other resources.
          </div>
        }
    }

    return defaultInput
  }

  render() {
    if (this.inputComponentType) {
      return this.inputComponentType(this.props.propertyTemplate)
    }

    return false
  }
}

PropertyComponent.propTypes = {
  propertyTemplate: PropTypes.shape({
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
