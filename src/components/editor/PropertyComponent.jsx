// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import shortid from 'shortid'
import PropTypes from 'prop-types'

export class PropertyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      configuration: this.getLookupConfigItems(this.props.propertyTemplate)
    }
  }

  getLookupConfigItems = propertyTemplate => {
    const vocabUriList = propertyTemplate?.valueConstraint?.useValuesFrom

    if (vocabUriList === undefined || vocabUriList.length === 0)
      return []

    const templateConfigItems = lookupConfig.filter(configItem => vocabUriList.includes(configItem.uri))

    return templateConfigItems
  }

  inputComponentType = property => {
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
        result = (<InputLookupQA key = {this.props.index} reduxPath={reduxPath}
                                 propertyTemplate = {property} lookupConfig = {this.state.configuration} />)
        break
      case "list":
        result = (<InputListLOC key = {this.props.index} reduxPath={reduxPath}
                                propertyTemplate = {property} lookupConfig = {this.state.configuration[0]} />)
        break
      default:
        switch(property.type) {
          case "literal":
            result = (<InputLiteral key={keyId} id={keyId}
                                    propertyTemplate={property}
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
  reduxPath: PropTypes.array.isRequired,
  index: PropTypes.number
}

export default PropertyComponent
