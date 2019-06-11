// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import lookupConfig from '../../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'

export class PropertyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      configuration: this.getLookupConfigItems(this.props.propertyTemplate),
    }
  }

  getLookupConfigItems = (propertyTemplate) => {
    const vocabUriList = propertyTemplate?.valueConstraint?.useValuesFrom

    if (vocabUriList === undefined || vocabUriList.length === 0) return []

    const templateConfigItems = lookupConfig.filter(configItem => vocabUriList.includes(configItem.uri))

    return templateConfigItems
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

    switch (config) {
      case 'lookup':
        return (<InputLookupQA key = {this.props.index}
                               reduxPath={reduxPath}
                               propertyTemplate = {property}
                               lookupConfig = {this.state.configuration}
                               displayValidations={this.props.displayValidations} />)
      case 'list':
        return (<InputListLOC key = {this.props.index}
                              reduxPath={reduxPath}
                              propertyTemplate = {property}
                              lookupConfig = {this.state.configuration[0]}
                              displayValidations={this.props.displayValidations} />)
      default:
        if (property.type === 'literal') {
          return (<InputLiteral key={keyId} id={keyId}
                                propertyTemplate={property}
                                reduxPath={reduxPath}
                                displayValidations={this.props.displayValidations} />)
        }
    }

    return false
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
  displayValidations: PropTypes.bool,
}

export default PropertyComponent
