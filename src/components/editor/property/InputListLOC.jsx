// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect, useMemo } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import defaultFilterBy from 'react-bootstrap-typeahead/lib/utils/defaultFilterBy'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { changeSelections as changeSelectionsAction } from 'actions/index'
import {
  itemsForProperty, getDisplayResourceValidations, getPropertyTemplate, findResourceValidationErrorsByPath,
} from 'selectors/resourceSelectors'
import { booleanPropertyFromTemplate, getLookupConfigItems } from 'utilities/propertyTemplates'
import { renderMenuFunc, renderTokenFunc } from './renderTypeaheadFunctions'
import fetchLookup from 'actionCreators/lookup'
import { findLookup } from 'selectors/entitySelectors'
import _ from 'lodash'

// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on URI in propertyTemplate.valueConstraint.useValuesFrom,
//  and the lookupConfig for the URI has component value of 'list'
const InputListLOC = (props) => {
  const dispatch = useDispatch()
  const changeSelections = payload => dispatch(changeSelectionsAction(payload))

  const propertyTemplate = useSelector((state) => {
    const resourceTemplateId = props.reduxPath[props.reduxPath.length - 2]
    const propertyURI = props.reduxPath[props.reduxPath.length - 1]
    return getPropertyTemplate(state, resourceTemplateId, propertyURI)
  })

  const [isRepeatable, setIsRepeatable] = useState(true)
  const [isMandatory, setIsMandatory] = useState(false)
  const [lookupConfigs, setlookupConfigs] = useState([])
  useEffect(() => {
    setIsRepeatable(booleanPropertyFromTemplate(propertyTemplate, 'repeatable', true))
    setIsMandatory(booleanPropertyFromTemplate(propertyTemplate, 'mandatory', false))
    setlookupConfigs(getLookupConfigItems(propertyTemplate))
  }, [propertyTemplate])

  useEffect(() => {
    lookupConfigs.forEach((lookupConfig) => {
      dispatch(fetchLookup(lookupConfig.uri))
    })
  }, [dispatch, lookupConfigs])

  const lookups = useSelector((state) => {
    const newLookups = {}
    lookupConfigs.forEach(lookupConfig => newLookups[lookupConfig.uri] = findLookup(state, lookupConfig.uri) || [])
    return newLookups
  })

  // Only update options when lookups or lookupConfigs change.
  const options = useMemo(() => {
    const newOptions = []
    lookupConfigs.forEach((lookupConfig) => {
      newOptions.push({ authLabel: lookupConfig.label, authURI: lookupConfig.uri })
      newOptions.push(...lookups[lookupConfig.uri] || [])
    })
    return newOptions
  }, [lookups, lookupConfigs])


  const selected = useSelector(state => itemsForProperty(state, props.reduxPath))

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

  const selectionChanged = (items) => {
    const payload = {
      id: propertyTemplate.propertyURI,
      items,
      reduxPath: props.reduxPath,
    }
    changeSelections(payload)
  }

  // Custom filterBy to retain authority labels when filtering to provide context.
  const filterBy = (option, props) => {
    if (option.authURI || option.isError) {
      return true
    }
    props.filterBy = ['label']
    return defaultFilterBy(option, props)
  }

  const displayValidations = useSelector(state => getDisplayResourceValidations(state))
  const validationErrors = useSelector(state => findResourceValidationErrorsByPath(state, props.reduxPath))

  let error
  let groupClasses = 'form-group'
  if (displayValidations && !_.isEmpty(validationErrors)) {
    groupClasses += ' has-error'
    error = validationErrors.join(',')
  }

  if (!propertyTemplate) {
    return null
  }

  return (
    <div className={groupClasses}>
      <Typeahead
        renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps)}
        renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
        allowNew={() => true }
        onChange={selected => selectionChanged(selected)}
        id="loc-vocab-list"
        required={isMandatory}
        multiple={isRepeatable}
        placeholder={propertyTemplate.propertyLabel}
        emptyLabel="retrieving list of terms..."
        useCache={true}
        selectHintOnEnter={true}
        options={options}
        selected={selected}
        filterBy={filterBy}
        onKeyDown={onKeyDown}
      />
      {error && <span className="help-block help-block-error">{error}</span>}
    </div>
  )
}

InputListLOC.propTypes = {
  reduxPath: PropTypes.array.isRequired,
}

export default InputListLOC
