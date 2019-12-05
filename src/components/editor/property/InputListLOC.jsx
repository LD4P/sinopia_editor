// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useEffect, useMemo, useRef,
} from 'react'
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
  const changeSelections = (payload) => dispatch(changeSelectionsAction(payload))

  const resourceTemplateId = props.reduxPath[props.reduxPath.length - 2]
  const propertyURI = props.reduxPath[props.reduxPath.length - 1]
  const propertyTemplate = useSelector((state) => getPropertyTemplate(state, resourceTemplateId, propertyURI))
  const typeAheadRef = useRef(null)

  const allLookupConfigs = useMemo(() => {
    const lookupConfigs = {}
    if (propertyTemplate) {
      getLookupConfigItems(propertyTemplate).forEach((lookupConfig) => lookupConfigs[lookupConfig.uri] = lookupConfig)
    }
    return lookupConfigs
  }, [propertyTemplate])
  const [selectedLookupConfigs, setSelectedLookupConfigs] = useState({})

  useEffect(() => {
    setSelectedLookupConfigs(allLookupConfigs)
  }, [allLookupConfigs])

  const isRepeatable = booleanPropertyFromTemplate(propertyTemplate, 'repeatable', true)

  useEffect(() => {
    Object.values(allLookupConfigs).forEach((lookupConfig) => {
      dispatch(fetchLookup(lookupConfig.uri))
    })
  }, [dispatch, allLookupConfigs])

  const lookups = useSelector((state) => {
    const newLookups = {}
    Object.values(allLookupConfigs).forEach((lookupConfig) => {
      newLookups[lookupConfig.uri] = findLookup(state, lookupConfig.uri) || []
    })
    return newLookups
  })

  // Only update options when lookups or lookupConfigs change.
  const options = useMemo(() => {
    const newOptions = []
    Object.values(selectedLookupConfigs).forEach((lookupConfig) => {
      newOptions.push({ authLabel: lookupConfig.label, authURI: lookupConfig.uri })
      newOptions.push(...lookups[lookupConfig.uri] || [])
    })
    return newOptions
  }, [lookups, selectedLookupConfigs])


  const selected = useSelector((state) => itemsForProperty(state, props.reduxPath))

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

  const lookupCheckboxes = Object.values(allLookupConfigs).map((lookupConfig) => {
    const id = `${props.reduxPath.join()}-${lookupConfig.uri}`
    return (
      <div key={lookupConfig.uri} className="form-check">
        <input className="form-check-input"
               type="checkbox" id={id}
               checked={!!selectedLookupConfigs[lookupConfig.uri]}
               onChange={() => toggleLookup(lookupConfig.uri)} />
        <label className="form-check-label" htmlFor={id}>
          {lookupConfig.label}
        </label>
      </div>
    ) })

  // Custom filterBy to retain authority labels when filtering to provide context.
  const filterBy = (option, props) => {
    if (option.authURI || option.isError) {
      return true
    }
    props.filterBy = ['label']
    return defaultFilterBy(option, props)
  }

  const toggleLookup = (uri) => {
    const newSelectedLookupConfigs = { ...selectedLookupConfigs }
    if (newSelectedLookupConfigs[uri]) {
      delete newSelectedLookupConfigs[uri]
    } else {
      newSelectedLookupConfigs[uri] = allLookupConfigs[uri]
    }
    setSelectedLookupConfigs(newSelectedLookupConfigs)
    typeAheadRef.current.getInstance().getInput().click()
  }


  const displayValidations = useSelector((state) => getDisplayResourceValidations(state))
  const validationErrors = useSelector((state) => findResourceValidationErrorsByPath(state, props.reduxPath))

  const isDisabled = selected?.length > 0 && !isRepeatable

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
    <React.Fragment>
      {lookupCheckboxes.length > 1 && lookupCheckboxes}
      <div className={groupClasses}>
        <Typeahead
          renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps, Object.values(selectedLookupConfigs))}
          renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
          allowNew={() => true }
          onChange={(selected) => selectionChanged(selected)}
          id="loc-vocab-list"
          multiple={true}
          placeholder={propertyTemplate.propertyLabel}
          emptyLabel="retrieving list of terms..."
          useCache={true}
          selectHintOnEnter={true}
          options={options}
          selected={selected}
          filterBy={filterBy}
          onKeyDown={onKeyDown}
          disabled={isDisabled}
          ref={(ref) => typeAheadRef.current = ref}
        />
        {error && <span className="text-danger">{error}</span>}
      </div>
    </React.Fragment>
  )
}

InputListLOC.propTypes = {
  reduxPath: PropTypes.array.isRequired,
}

export default InputListLOC
