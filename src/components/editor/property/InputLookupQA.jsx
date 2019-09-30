// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { Typeahead, asyncContainer } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import shortid from 'shortid'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import getSearchResults from 'utilities/qa'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import _ from 'lodash'
import { renderMenuFunc, renderTokenFunc } from './renderTypeaheadFunctions'

const AsyncTypeahead = asyncContainer(Typeahead)


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
      if (authority.isError) {
        options.push({
          isError: true,
          label: authority.errorObject.message,
          id: shortid.generate(),
        })
        return
      }
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
    selected: props.selected,
    isLoading: props.isLoading,
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
