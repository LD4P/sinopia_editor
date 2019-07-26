// Copyright 2019 Stanford University see LICENSE for license
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import Swagger from 'swagger-client'
import swaggerSpec from 'lib/apidoc.json'
import { connect } from 'react-redux'
import {
  getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { booleanPropertyFromTemplate, getLookupConfigItems } from 'Utilities'
import Config from 'Config'
import _ from 'lodash'
import InputLookupQATypeahead from './InputLookupQATypeahead'
import InputLookupQAContext from './InputLookupQAContext'


// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on values in propertyTemplate.valueConstraint.useValuesFrom
//  and the lookupConfig for the URIs has component value of 'lookup'
class InputLookupQA extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      options: [],
    }
  }

  get isMandatory() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
  }

  get isRepeatable() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)
  }


    search = (query) => {
      const lookupConfigs = this.props.lookupConfig
      const componentType = this.props.propertyTemplate.subtype ? this.props.propertyTemplate.subtype : 'typeahead'
      const isContext = componentType === 'context' || componentType === 'discogs'
      this.setState({ isLoading: true })
      Swagger({ spec: swaggerSpec }).then((client) => {
        // Create array of promises based on the lookup config array that is sent in
        const lookupPromises = lookupConfigs.map((lookupConfig) => {
          const authority = lookupConfig.authority
          const subauthority = lookupConfig.subauthority
          const language = lookupConfig.language

          /*
           *  There are two types of lookup: linked data and non-linked data. The API calls
           *  for each type are different, so check the nonldLookup field in the lookup config.
           *  If the field is not set, assume false.
           */
          const nonldLookup = lookupConfig.nonldLookup ? lookupConfig.nonldLookup : false

          // default the API calls to their linked data values
          let subAuthCall = 'GET_searchSubauthority'
          let authorityCall = 'GET_searchAuthority'

          // Change the API calls if this is a non-linked data lookup
          if (nonldLookup) {
            subAuthCall = 'GET_nonldSearchWithSubauthority'
            authorityCall = 'GET_nonldSearchAuthority'
          }

          /*
           *Return the 'promise'
           *Since we don't want promise.all to fail if
           *one of the lookups fails, we want a catch statement
           *at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
           *The only difference between this call and the next one is the call to Get_searchSubauthority instead of
           *Get_searchauthority.  Passing API call in a variable name/dynamically, thanks @mjgiarlo
           */
          const actionFunction = subauthority ? subAuthCall : authorityCall

          return client
            .apis
            .SearchQuery?.[actionFunction]({
              q: query,
              vocab: authority,
              subauthority,
              maxRecords: Config.maxRecordsForQALookups,
              lang: language,
              context: isContext,
            })
            .catch((err) => {
              console.error('Error in executing lookup against source', err)
              // Return information along with the error in its own object
              return { isError: true, errorObject: err }
            })
        })

        /*
         * If undefined, add info - note if error, error object returned in object
         * which allows attaching label and uri for authority
         */
        Promise.all(lookupPromises).then((values) => {
          for (let i = 0; i < values.length; i++) {
            if (values[i]) {
              values[i].authLabel = lookupConfigs[i].label
              values[i].authURI = lookupConfigs[i].uri
              values[i].label = lookupConfigs[i].label
              values[i].id = lookupConfigs[i].uri
            }
          }

          this.setState({
            isLoading: false,
            options: values,
          })
        })
      }).catch((e) => {
        console.error(e)
      })
    }

    clearOptions = () => {
      this.setState({ options: [] })
    }

      getComponentType = () => (this.props.propertyTemplate.subtype ? this.props.propertyTemplate.subtype : 'typeahead')

      render() {
        // Don't render if don't have property templates yet.
        if (!this.props.propertyTemplate) {
          return null
        }
        // error and validation
        let error
        let groupClasses = 'form-group'

        if (this.props.displayValidations && !_.isEmpty(this.props.errors)) {
          groupClasses += ' has-error'
          error = this.props.errors.join(',')
        }

        // typeahead by default otherwise use subtype
        const componentType = this.getComponentType()
        // some options will be shared across component
        // const componentType = 'typeahead'
        if (componentType === 'context')
        { return (
          <div className={groupClasses}>
            <InputLookupQAContext
            isloading={this.state.isLoading}
            clearOptions={this.clearOptions}
            options={this.state.options}
            search={this.search}
            isMandatory={this.isMandatory}
            isRepeatable={this.isRepeatable}
            {...this.props}
            />
            {error && <span className="help-block">{error}</span>}
          </div>
        ) }
        // Both Discogs and Typeahead are in one component
        return (<div className={groupClasses}>
          <InputLookupQATypeahead
            isLoading={this.state.isLoading}
            options={this.state.options}
            search={this.search}
            isMandatory={this.isMandatory}
            isRepeatable={this.isRepeatable}
            {...this.props}
          />
          {error && <span className="help-block">{error}</span>}
        </div>)
      }
}

InputLookupQA.propTypes = {
  displayValidations: PropTypes.bool,
  lookupConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  errors: PropTypes.array,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)
  const errors = findErrors(state.selectorReducer, ownProps.reduxPath)

  return {
    reduxPath,
    propertyTemplate,
    displayValidations,
    lookupConfig,
    errors,
  }
}

export default connect(mapStateToProps, null)(InputLookupQA)
