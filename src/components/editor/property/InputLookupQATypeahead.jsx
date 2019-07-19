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

const AsyncTypeahead = asyncContainer(Typeahead)

// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on values in propertyTemplate.valueConstraint.useValuesFrom
//  and the lookupConfig for the URIs has component value of 'lookup'
class InputLookupQATypeahead extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
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

  validate() {
    if (!this.typeahead) {
      return
    }
    const selected = this.typeahead.getInstance().state.selected

    return this.props.displayValidations && this.isMandatory && selected.length < 1 ? 'Required' : undefined
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
      isLoading: this.props.isLoading,
      onSearch: this.props.doSearch,
      options: this.props.options,
      selected: this.props.selected,
      delay: 300,
    }

    let groupClasses = 'form-group'
    const error = this.validate()

    if (error) {
      groupClasses += ' has-error'
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

InputLookupQATypeahead.propTypes = {
  doSearch: PropTypes.func,
  isLoading: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
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

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQATypeahead)
