// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer, Token,
} from 'react-bootstrap-typeahead'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import shortid from 'shortid'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { getSearchResults } from 'actionCreators/qa'
import { isValidURI } from 'Utilities'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import _ from 'lodash'
import RenderLookupContext from './RenderLookupContext'

const AsyncTypeahead = asyncContainer(Typeahead)


export const renderMenuFunc = (results, menuProps) => {
  const items = []
  let authURI
  let authLabel

  /*
   * Returning results
   * If error is returned, it will be used to display for that source
   */
  results.forEach((result, i) => {
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
        <MenuItem option={option} position={i} key={i}>
          {result.label}
        </MenuItem>,
      )
      return
    }

    if (result.isError) {
      const errorMessage = 'An error occurred in retrieving results'

      items.push(
        <Menu.Header key={shortid.generate()}>
          <span className="dropdown-error">{errorMessage}</span>
        </Menu.Header>,
      )

      // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
      return
    }
    if ('authURI' in result) {
      authLabel = result.authLabel
      authURI = result.authURI
      const labelKey = `${authLabel}-header`
      items.push(<Menu.Header key={labelKey}>{authLabel}</Menu.Header>)
      return
    }
    let bgClass = 'context-result-bg'
    if (i % 2 === 0) {
      bgClass = 'context-result-alt-bg'
    }
    items.push(
      <MenuItem option={result} position={i} key={i}>
        {result.context ? (
          <RenderLookupContext innerResult={result} authLabel={authLabel} authURI={authURI} colorClassName={bgClass}></RenderLookupContext>
        ) : result.label
        }
      </MenuItem>,
    )
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
  const [authorities, setAuthorities] = useState([])

  const search = (query) => {
    const currentAuthorities = []
    const resultPromise = getSearchResults(query, props.propertyTemplate)
    resultPromise.then((result) => {
      result.forEach((authority) => {
        currentAuthorities.push(authority)
      })
      setAuthorities(currentAuthorities)
    })
  }

  const getOptions = (authorities) => {
    const options = []
    authorities.forEach((authority) => {
      const authLabel = authority.authLabel
      const authURI = authority.authURI
      options.push({
        authURI,
        authLabel,
        label: authLabel,
      })
      authority.body.forEach((option) => {
        options.push(option)
      })
    })
    return options
  }

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
                      options={getOptions(authorities)}
                      onSearch={search}
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

  return {
    selected,
    propertyTemplate,
    displayValidations,
    errors,
    isLoading,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ changeSelections }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQA)
