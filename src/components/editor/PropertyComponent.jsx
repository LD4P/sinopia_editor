// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import shortid from 'shortid'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import PropTypes from 'prop-types'
const _ = require('lodash')

export class PropertyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      configuration: getLookupConfigItems(this.props.propertyTemplate)
    }
  }

  inputComponentType = (property) => {
    let config, result

    // We do not support mixed list and lookups, so we will just go with the value of the first config item found
    try {
      config = this.state.configuration[0].component
    } catch {
      // ignore undefined configuration
    }
    const reduxPath = Object.assign([], this.props.reduxPath)
    reduxPath.push(property.propertyURI)
    const keyId = shortid.generate()
    switch(config) {
      case "lookup":
        result = (<InputLookupQA key = {keyId} rtId = {this.props.rtId} reduxPath={[this.props.rtId, property.propertyURI]}
                                 propertyTemplate = {property} lookupConfig = {this.state.configuration} />)
        break
      case "list":
        result = (<InputListLOC key = {keyId} reduxPath={[this.props.rtId, property.propertyURI]}
                                propertyTemplate = {property} lookupConfig = {this.state.configuration}/>)
        break
      default:
        switch(property.type) {
          case "literal":
            result = (<InputLiteral key={keyId} id={keyId}
                                    propertyTemplate={property}
                                    rtId={this.props.rtId}
                                    reduxPath={reduxPath} />)
            break
          default:
            result = false
        }
    }

    return result
  }

  render() {
    if (this.inputComponentType) {
      return(
        <React.Fragment>
          { this.inputComponentType(this.props.propertyTemplate) }
        </React.Fragment>
      )
    } else {
      return false
    }
  }
}

export const getLookupConfigItems = (property) => {
  const templateConfigItems = []

  if (_.find([property], 'valueConstraint.useValuesFrom')) {
    property.valueConstraint.useValuesFrom.map(templateUri => {
      lookupConfig.map(configItem => {
        if (configItem.uri === templateUri) {
          templateConfigItems.push(configItem)
        }
      })
    })
  }

  return templateConfigItems
}

PropertyComponent.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    propertyURI: PropTypes.string,
    mandatory: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([ PropTypes.string, PropTypes.array])
    })
  }).isRequired,
  reduxPath: PropTypes.array,
  rtId: PropTypes.string,
  index: PropTypes.number
}

export default PropertyComponent
