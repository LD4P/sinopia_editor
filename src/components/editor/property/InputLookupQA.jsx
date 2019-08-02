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
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { isValidURI } from 'Utilities'
import { booleanPropertyFromTemplate, getLookupConfigItems } from 'utilities/propertyTemplates'
import Config from 'Config'
import _ from 'lodash'

const AsyncTypeahead = asyncContainer(Typeahead)

// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on values in propertyTemplate.valueConstraint.useValuesFrom
//  and the lookupConfig for the URIs has component value of 'lookup'
class InputLookupQA extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
    }
  }

  // From https://github.com/ericgio/react-bootstrap-typeahead/issues/389
  onKeyDown = (e) => {
    // 8 = backspace
    if (e.keyCode === 8
        && e.target.value === '') {
      // Don't trigger a "back" in the browser on backspace
      e.returnValue = false
      e.preventDefault()
    }
  }

  // Render token function to be used by typeahead
  renderTokenFunc = (option, props, idx) => {
    const optionLabel = getOptionLabel(option, props.labelKey)
    const children = option.uri ? (<a href={option.uri} rel="noopener noreferrer" target="_blank">{optionLabel}</a>) : optionLabel
    return (
      <Token
          disabled={props.disabled}
          key={idx}
          onRemove={props.onRemove}
          tabIndex={props.tabIndex}>
        { children }
      </Token>
    )
  }

  // Render menu function to be used by typeahead
  renderMenuFunc = (results, menuProps) => {
    const items = []
    let menuItemIndex = 0

    /*
     * Returning results per each promise
     * If error is returned, it will be used to display for that source
     */
    results.forEach((result, _i, list) => {
      if (result.customOption) {
        let headerLabel
        let option
        if (isValidURI(result.label)) {
          headerLabel = 'New URI'
          option = {
            id: result.label,
            label: result.label,
            uri: result.label,
          }
        } else {
          headerLabel = 'New Literal'
          option = {
            id: result.label,
            label: result.label,
            content: result.label,
          }
        }
        items.push(<Menu.Header key="customOption-header">{headerLabel}</Menu.Header>)
        items.push(
          <MenuItem option={option} position={menuItemIndex} key={menuItemIndex}>
            {result.label}
          </MenuItem>,
        )
        menuItemIndex++
        return
      }
      const authLabel = result.authLabel
      const headerKey = `${result.authURI}-header`

      if (list.length > 1) items.push(<Menu.Header key={headerKey}>{authLabel}</Menu.Header>)

      if (result.isError) {
        const errorMessage = 'An error occurred in retrieving results'
        const errorHeaderKey = `${headerKey}-error`

        items.push(
          <Menu.Header key={errorHeaderKey}>
            <span className="dropdown-error">{errorMessage}</span>
          </Menu.Header>,
        )

        // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
        return
      }

      const body = result.body

      if (body.length === 0) {
        const noResultsMessage = 'No results for this lookup'
        const noResultsHeaderKey = `${headerKey}-noResults`

        items.push(
          <Menu.Header key={noResultsHeaderKey}>
            <span className="dropdown-empty">{noResultsMessage}</span>
          </Menu.Header>,
        )

        // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
        return
      }

      body.forEach((innerResult) => {
        items.push(
          <MenuItem option={innerResult} position={menuItemIndex} key={menuItemIndex}>
            {innerResult.label}
          </MenuItem>,
        )
        menuItemIndex++
      })
    })
    return (
      <Menu {...menuProps} id={menuProps.id}>
        {items}
      </Menu>
    )
  }

  get isMandatory() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
  }

  get isRepeatable() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)
  }

  search() {
    const lookupConfigs = this.props.lookupConfig

    return (query) => {
      this.setState({ isLoading: true })
      Swagger({ spec: swaggerSpec }).then((client) => {
        // Create array of promises based on the lookup config array that is sent in
        const lookupPromises = lookupConfigs.map((lookupConfig) => {
          const authority = lookupConfig.authority
          const subauthority = lookupConfig.subauthority
          const language = lookupConfig.language

          /*
           *Return the 'promise'
           *Since we don't want promise.all to fail if
           *one of the lookups fails, we want a catch statement
           *at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
           *The only difference between this call and the next one is the call to Get_searchSubauthority instead of
           *Get_searchauthority.  Passing API call in a variable name/dynamically, thanks @mjgiarlo
           */
          const actionFunction = subauthority ? 'GET_searchSubauthority' : 'GET_searchAuthority'

          return client
            .apis
            .SearchQuery?.[actionFunction]({
              q: query,
              vocab: authority,
              subauthority,
              maxRecords: Config.maxRecordsForQALookups,
              lang: language,
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
  }

  render() {
    // Don't render if no property template yet
    if (!this.props.propertyTemplate) {
      return null
    }

    const typeaheadProps = {
      id: 'lookupComponent',
      required: this.isMandatory,
      multiple: this.isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      onSearch: this.search(),
      options: this.state.options,
      selected: this.props.selected,
      allowNew: true,
      delay: 300,
      onKeyDown: this.onKeyDown,
    }

    let error
    let groupClasses = 'form-group'

    if (this.props.displayValidations && !_.isEmpty(this.props.errors)) {
      groupClasses += ' has-error'
      error = this.props.errors.join(',')
    }
    return (
      <div className={groupClasses}>
        <AsyncTypeahead renderMenu={(results, menuProps) => this.renderMenuFunc(results, menuProps)}
                        ref={typeahead => this.typeahead = typeahead }
                        onChange={(selected) => {
                          const payload = {
                            uri: this.props.propertyTemplate.propertyURI,
                            items: selected,
                            reduxPath: this.props.reduxPath,
                          }

                          this.props.handleSelectedChange(payload)
                        }}
                        renderToken={(option, props, idx) => this.renderTokenFunc(option, props, idx)}
                        {...typeaheadProps}

                        filterBy={() => true
                        }
        />
        {error && <span className="help-block">{error}</span>}
      </div>
    )
  }
}

InputLookupQA.propTypes = {
  displayValidations: PropTypes.bool,
  handleSelectedChange: PropTypes.func,
  lookupConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selected: PropTypes.arrayOf(PropTypes.object),
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
  const selected = itemsForProperty(state, ownProps.reduxPath)

  return {
    selected,
    reduxPath,
    propertyTemplate,
    displayValidations,
    lookupConfig,
    errors,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQA)
