// Copyright 2019 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer, Token,
} from 'react-bootstrap-typeahead'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'

import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import Swagger from 'swagger-client'
import swaggerSpec from 'lib/apidoc.json'
import { connect } from 'react-redux'
import { itemsForProperty, getDisplayValidations, getPropertyTemplate } from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { booleanPropertyFromTemplate, getLookupConfigItems } from 'Utilities'
import Config from 'Config'
import InputLookupQATypeahead from './InputLookupQATypeahead'
import InputLookupQAContext from './InputLookupQAContext'
import InputLookupQADiscogs from './InputLookupQADiscogs'

const AsyncTypeahead = asyncContainer(Typeahead)

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

  doSearch = (query) => {
    const lookupConfigs = this.props.lookupConfig
    // With every new query, clear out the results from the past query
    this.setState({ isLoading: true, options: [] })
    const componentType = this.props.propertyTemplate.subtype ? this.props.propertyTemplate.subtype : 'typeahead'
    const isContext = componentType === 'context' || componentType === 'discogs'
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
        const actionFunction = lookupConfig.subauthority ? subAuthCall : authorityCall

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
          }
        }
        console.log('Updating options in parent state')
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
      // typeahead by default otherwise use subtype
      const componentType = this.getComponentType()
      // let componentType = 'typeahead'
      if (componentType === 'context')
      { return (<InputLookupQAContext
          isloading={this.state.isLoading}
          options={this.state.options}
          doSearch={this.doSearch}
          clearOptions={this.clearOptions}
          {...this.props}
      />) }
      if (componentType === 'discogs')
      { return (<InputLookupQADiscogs
          isLoading={this.state.isLoading}
          options={this.state.options}
          doSearch={this.doSearch}
          {...this.props}
      />) }
      return (<InputLookupQATypeahead
          isLoading={this.state.isLoading}
          options={this.state.options}
          doSearch={this.doSearch}
          {...this.props}
      />)
    }


    get isMandatory() {
      return booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
    }

    get isRepeatable() {
      return booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)
    }

    validate() {
      if (!this.typeahead) {
        return
      }
      const selected = this.typeahead.getInstance().state.selected

      return this.props.displayValidations && this.isMandatory && selected.length < 1 ? 'Required' : undefined
    }
}
InputLookupQA.propTypes = {
  displayValidations: PropTypes.bool,
  handleSelectedChange: PropTypes.func,
  lookupConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selected: PropTypes.arrayOf(PropTypes.object),
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)

  // Make sure that every item has a label
  // This is a temporary strategy until label lookup is implemented.
  const selected = itemsForProperty(state.selectorReducer, ownProps.reduxPath).map((item) => {
    const newItem = { ...item }
    if (newItem.label === undefined) {
      newItem.label = newItem.uri
    }
    return newItem
  })

  return {
    selected,
    reduxPath,
    propertyTemplate,
    displayValidations,
    lookupConfig,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQA)
