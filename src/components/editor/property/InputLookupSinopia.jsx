
// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { Typeahead, asyncContainer } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayResourceValidations, getPropertyTemplate,
  findResourceValidationErrorsByPath,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import { renderMenuFunc, renderTokenFunc } from './renderTypeaheadFunctions'
import { getSearchResults } from 'sinopiaSearch'
import _ from 'lodash'

const AsyncTypeahead = asyncContainer(Typeahead)

const InputLookupSinopia = (props) => {
  const [isLoading, setLoading] = useState(false)
  const [options, setOptions] = useState([])

  // Don't render if no property template yet
  if (!props.propertyTemplate) {
    return null
  }

  const isRepeatable = booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)

  const search = (query) => {
    setLoading(true)
    getSearchResults(query)
      .then((searchResults) => {
        setOptions(searchResults.results)
        setLoading(false)
      })
  }

  const change = (selected) => {
    const payload = {
      uri: props.propertyTemplate.propertyURI,
      items: selected,
      reduxPath: props.reduxPath,
    }

    props.changeSelections(payload)
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

  let error
  let groupClasses = 'form-group'

  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
  }

  return (
    <div className={groupClasses}>
      <AsyncTypeahead renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps, props.propertyTemplate)}
                      renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
                      onSearch={search}
                      onChange={change}
                      onKeyDown={onKeyDown}
                      options={options}
                      multiple={isRepeatable}
                      isLoading={isLoading}
                      selected={props.selected}
                      placeholder={props.propertyTemplate.propertyLabel}
                      minLength={1}
                      filterBy={() => true }
                      allowNew={() => true }
                      id="sinopia-lookup" />

      <span className="help-block">Use a * to wildcard your search.</span>
      {error && <span className="help-block help-block-error">{error}</span>}
    </div>
  )
}

InputLookupSinopia.propTypes = {
  displayValidations: PropTypes.bool,
  changeSelections: PropTypes.func,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selected: PropTypes.arrayOf(PropTypes.object),
  errors: PropTypes.array,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayResourceValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const errors = findResourceValidationErrorsByPath(state, ownProps.reduxPath)
  const selected = itemsForProperty(state, ownProps.reduxPath)

  return {
    selected,
    reduxPath,
    propertyTemplate,
    displayValidations,
    errors,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ changeSelections }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupSinopia)
