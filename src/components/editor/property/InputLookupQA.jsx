// Copyright 2018 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer,
} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import swaggerSpec from 'lib/apidoc.json'
import { connect } from 'react-redux'
import { getProperty, getDisplayValidations, getPropertyTemplate } from 'reducers/index'
import { changeSelections } from 'actions/index'
import { booleanPropertyFromTemplate, defaultValuesFromPropertyTemplate, getLookupConfigItems } from 'Utilities'
import Config from 'Config'
import InputLookupQATypeahead from './InputLookupQATypeahead'
import InputLookupQAContext from './InputLookupQAContext'

class InputLookupQA extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
      // Don't render if don't have property templates yet.
      if (!this.props.propertyTemplate) {
        return null
      }
      //typeahead by default otherwise use subtype
      let componentType = this.props.propertyTemplate.subtype? this.props.propertyTemplate.subtype : "typeahead"
      if(componentType == "context")
          return (<InputLookupQAContext
              {...this.props} 
               />)
      else 
          return (<InputLookupQATypeahead
                  {...this.props} 
                   />)
      
  }
}

InputLookupQA.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }),
  }),
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, props) => {
    const reduxPath = props.reduxPath
    const resourceTemplateId = reduxPath[reduxPath.length - 2]
    const propertyURI = reduxPath[reduxPath.length - 1]
    const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
    const lookupConfig = getLookupConfigItems(propertyTemplate)
    return { 
        reduxPath,
        propertyTemplate,
        lookupConfig,}
}

export default connect(mapStateToProps, null)(InputLookupQA)
