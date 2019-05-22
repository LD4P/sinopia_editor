// Copyright 2019 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
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

    try {
      config = this.state.configuration[0].component
    } catch {
      // ignore undefined configuration
    }

    // We do not support mixed list and lookups, so we will just go with the value of the first config item found
    switch(config) {
      case "lookup":
        result = (<InputLookupQA key = {this.props.index} rtId = {this.props.rtId}
                                 propertyTemplate = {property} lookupConfig = {this.state.configuration} />)
        break
      case "list":
        result = (<InputListLOC key = {this.props.index} reduxPath={[this.props.rtId, property.propertyURI]}
                                propertyTemplate = {property} lookupConfig = {this.state.configuration}/>)
        break
      default:
        switch(property.type) {
          case "literal":
            result = (<InputLiteral key={this.props.index} id={this.props.index}
                                    propertyTemplate={property}
                                    rtId={this.props.rtId}
                                    reduxPath={[this.props.rtId, property.propertyURI]} />)
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
        <div>
          { this.inputComponentType(this.props.propertyTemplate) }
        </div>
      )
    } else {
      return false
    }
  }
}

export const getLookupConfigItems = (property) => {
  const templateConfigItems = []

  if (_.find([property], 'valueConstraint.useValuesFrom')) {
    property.valueConstraint.useValuesFrom.forEach(templateUri => {
      const configItem = getLookupConfigForTemplateUri(templateUri)
      templateConfigItems.push(configItem)
    })
  }
  return templateConfigItems
}

export const getLookupConfigForTemplateUri = (templateUri) => {
  let returnConfigItem = {}
  lookupConfig.forEach(configItem => {
    if (configItem.uri === templateUri) {
      returnConfigItem = configItem
    }
  })
  return returnConfigItem
}

PropertyComponent.propTypes = {
  propertyTemplate: PropTypes.object,
  rtId: PropTypes.string,
  index: PropTypes.number
}

export default PropertyComponent