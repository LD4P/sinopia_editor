// Copyright 2019 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer, Token,
} from 'react-bootstrap-typeahead'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { getLookupConfigItems, isValidURI } from 'Utilities'


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
        const menuItemContent = this.renderContext(innerResult, authLabel)
        items.push(
          <MenuItem option={innerResult} position={menuItemIndex} key={menuItemIndex}>
            {menuItemContent}
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

  // Discogs specific functions
  // This relies on auth label but would be better dependent on authority URI
  renderContext = (innerResult, authLabel) => {
    switch (authLabel) {
      case 'Discogs':
        return this.buildDiscogsContext(innerResult)
      default:
        return innerResult.label
    }
  }

    buildDiscogsContext = (innerResult) => {
      // const url = innerResult.uri
      const context = innerResult.context
      const imageUrl = context['Image URL'][0]
      let year = ''
      if (context.Year[0].length > 0) {
        year = `(${context.Year[0]})`
      }
      const recLabel = context['Record Labels'][0]
      const formats = context.Formats.toString()
      // const discogsType = context.Type[0]
      // const target = '_blank'
      const type = context.Type[0].charAt(0).toUpperCase() + context.Type[0].slice(1)
      return (
        <div className="row discogs-container">
          <div className="image-container col-md-2">
            <img alt="Result" className="discogs-image-style" src={imageUrl}/><br />
          </div>
          <div className="col-md-10 details-container">
            {innerResult.label} {year}<br />
            <b>Format: </b>{formats}<br />
            <b>Label: </b>{recLabel}<span className="type-span"><b>Type: </b>{type}</span>
          </div>
        </div>
      )
    }

    render() {
    // Don't render if no property template yet
      if (!this.props.propertyTemplate) {
        return null
      }

      const typeaheadProps = {
        id: 'lookupComponent',
        required: this.props.isMandatory,
        multiple: this.props.isRepeatable,
        placeholder: this.props.propertyTemplate.propertyLabel,
        useCache: true,
        selectHintOnEnter: true,
        isLoading: this.props.isLoading,
        onSearch: this.props.search,
        options: this.props.options,
        selected: this.props.selected,
        allowNew: true,
        delay: 300,
      }

      return (
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

      )
    }
}

InputLookupQATypeahead.propTypes = {
  displayValidations: PropTypes.bool,
  handleSelectedChange: PropTypes.func,
  lookupConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selected: PropTypes.arrayOf(PropTypes.object),
  errors: PropTypes.array,
  search: PropTypes.func,
  isLoading: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  isMandatory: PropTypes.bool,
  isRepeatable: PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)
  const errors = findErrors(state.selectorReducer, ownProps.reduxPath)

  // Make sure that every item has a label
  // This is a temporary strategy until label lookup is implemented.
  const selected = itemsForProperty(state.selectorReducer, ownProps.reduxPath).map((item) => {
    const newItem = { ...item }
    if (newItem.label === undefined) {
      if (newItem.uri) {
        newItem.label = newItem.uri
      } else if (newItem.content) {
        newItem.label = newItem.content
      }
    }
    return newItem
  })

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

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQATypeahead)
