// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer, Token,
} from 'react-bootstrap-typeahead'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'

import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import search from 'actionCreators/qa'
import { isValidURI } from 'Utilities'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import _ from 'lodash'
import RenderLookupContext from './RenderLookupContext'

const AsyncTypeahead = asyncContainer(Typeahead)

// Render menu function to be used by typeahead
export const renderMenuFunc = (results, menuProps) => {
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
    const authURI = result.authURI
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

    let idx = 0
    body.forEach((innerResult) => {
      let bgClass = 'context-result-bg'
      idx++
      if (idx % 2 === 0) {
        bgClass = 'context-result-alt-bg'
      }
      items.push(
        <MenuItem option={innerResult} position={menuItemIndex} key={menuItemIndex}>
          {innerResult.context ? (
            <RenderLookupContext innerResult={innerResult} authLabel={authLabel} authURI={authURI} colorClassName={bgClass}></RenderLookupContext>
          ) : innerResult.label
          }
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

// Render token function to be used by typeahead
export const renderTokenFunc = (option, tokenProps, idx) => {
  const optionLabel = getOptionLabel(option, tokenProps.labelKey)
  const children = option.uri ? (<a href={option.uri} rel="noopener noreferrer" target="_blank">{optionLabel}</a>) : optionLabel
  return (
    <Token
        disabled={tokenProps.disabled}
        key={idx}
        onRemove={tokenProps.onRemove}
        tabIndex={tokenProps.tabIndex}>
      { children }
    </Token>
  )
}


// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on values in propertyTemplate.valueConstraint.useValuesFrom
//  and the lookupConfig for the URIs has component value of 'lookup'
const InputLookupQA = (props) => {
  // Don't render if no property template yet
  if (!props.propertyTemplate) {
    return null
  }

  // From https://github.com/ericgio/react-bootstrap-typeahead/issues/389
  const onKeyDown = (e) => {
    // 8 = backspace
    if (e.keyCode === 8
        && e.target.value === '') {
      // Don't trigger a "back" in the browser on backspace
      e.returnValue = false
      e.preventDefault()
    }
  }

  const isMandatory = booleanPropertyFromTemplate(props.propertyTemplate, 'mandatory', false)

  const isRepeatable = booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)

  const typeaheadProps = {
    id: 'lookupComponent',
    required: isMandatory,
    multiple: isRepeatable,
    placeholder: props.propertyTemplate.propertyLabel,
    useCache: true,
    selectHintOnEnter: true,
    isLoading: props.isLoading,
    onSearch: query => props.search(query, props.propertyTemplate),
    options: props.options,
    selected: props.selected,
    allowNew: true,
    delay: 300,
    onKeyDown,
  }

  let error
  let groupClasses = 'form-group'

  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
  }

  return (
    <div className={groupClasses}>
      <AsyncTypeahead renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps)}
                      onChange={(selected) => {
                        const payload = {
                          uri: props.propertyTemplate.propertyURI,
                          items: selected,
                          reduxPath: props.reduxPath,
                        }

                        props.changeSelections(payload)
                      }}
                      renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
                      {...typeaheadProps}

                      filterBy={() => true
                      }
      />
      {error && <span className="help-block help-block-error">{error}</span>}
    </div>
  )
}

InputLookupQA.propTypes = {
  displayValidations: PropTypes.bool,
  changeSelections: PropTypes.func,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selected: PropTypes.arrayOf(PropTypes.object),
  search: PropTypes.func,
  errors: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const errors = findErrors(state, ownProps.reduxPath)
  const selected = itemsForProperty(state, ownProps.reduxPath)
  const isLoading = state.selectorReducer.entities.qa.loading
  const options = state.selectorReducer.entities.qa.options

  return {
    selected,
    propertyTemplate,
    displayValidations,
    errors,
    isLoading,
    options,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ changeSelections, search }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQA)
