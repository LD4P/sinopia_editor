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
class InputLookupQADiscogs extends Component {
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

  renderContext = (innerResult, authLabel) => {
    switch (authLabel) {
      case 'Discogs':
        return this.buildDiscogsContext(innerResult)
      default:
        return innerResult.label
    }
  }

    buildDiscogsContext = (innerResult) => {
      const discogsContainer = {
        padding: '0 0 4px 3px',
      }

      const detailsContainer = {
        padding: '0 0 0 8px',
        whiteSpace: 'normal',
      }

      const imageContainer = {
        width: '50px',
        overflow: 'hidden',
        padding: '3px 0 0',
        textAlign: 'center',
      }

      const discogsImageStyle = {
        width: '100%',
        marginRight: '10px',
        verticalAlign: 'top',
      }

      const typeSpan = {
        paddingLeft: '8px',
      }


      const url = innerResult.uri
      const context = innerResult.context
      const image_url = context['Image URL'][0]
      let year = ''
      if (context.Year[0].length > 0) {
        year = `(${context.Year[0]})`
      }
      const rec_label = context['Record Labels'][0]
      const formats = context.Formats.toString()
      const discogs_type = context.Type[0]
      const target = '_blank'
      const type = context.Type[0].charAt(0).toUpperCase() + context.Type[0].slice(1)
      const row = 'row'
      const colTwo = 'col-md-2'
      const colTen = 'col-md-10'
      return (
        <div className={row} style={discogsContainer}>
          <div className={colTwo} style={imageContainer}>
            <img alt="Result" style={discogsImageStyle} src={image_url}/><br />
          </div>
          <div className={colTen} style={detailsContainer}>
            {innerResult.label} {year}<br />
            <b>Format: </b>{formats}<br />
            <b>Label: </b>{rec_label}<span style={typeSpan}><b>Type: </b>{type}</span>
          </div>
        </div>
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
      // this differs from regular typeahead in that it retrieves and displays context
      // TODO: Pull this function out separately as the rest of the function stays identical
      body.forEach((innerResult) => {
        const itemContext = this.renderContext(innerResult, authLabel)
        items.push(
          <MenuItem option={innerResult} position={menuItemIndex} key={menuItemIndex}>
            {itemContext}
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

InputLookupQADiscogs.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQADiscogs)
