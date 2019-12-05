// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useRef, useMemo, useEffect,
} from 'react'
import { Typeahead, asyncContainer } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
  itemsForProperty, getDisplayResourceValidations, getPropertyTemplate, findResourceValidationErrorsByPath,
} from 'selectors/resourceSelectors'
import { changeSelections as changeSelectionsAction } from 'actions/index'
import { booleanPropertyFromTemplate, getLookupConfigItems } from 'utilities/propertyTemplates'
import _ from 'lodash'
import { renderMenuFunc, renderTokenFunc } from './renderTypeaheadFunctions'


const AsyncTypeahead = asyncContainer(Typeahead)

const InputLookup = (props) => {
  const dispatch = useDispatch()
  const changeSelections = (payload) => dispatch(changeSelectionsAction(payload))
  const [, setTriggerRender] = useState('')
  // Using a ref so that can append to current list of results.
  const allResults = useRef([])
  // Tokens allow us to cancel an existing search. Does not actually stop the
  // search, but causes result to be ignored.
  const tokens = useRef([])

  const resourceTemplateId = props.reduxPath[props.reduxPath.length - 2]
  const propertyURI = props.reduxPath[props.reduxPath.length - 1]
  const displayValidations = useSelector((state) => getDisplayResourceValidations(state))
  const propertyTemplate = useSelector((state) => getPropertyTemplate(state, resourceTemplateId, propertyURI))
  const errors = useSelector((state) => findResourceValidationErrorsByPath(state, props.reduxPath))
  const selected = useSelector((state) => itemsForProperty(state, props.reduxPath))
  const [selectedLookupConfigs, setSelectedLookupConfigs] = useState({})
  const [query, setQuery] = useState(false)
  const typeAheadRef = useRef(null)

  const allLookupConfigs = useMemo(() => {
    const lookupConfigs = {}
    if (propertyTemplate) {
      getLookupConfigItems(propertyTemplate).forEach((lookupConfig) => lookupConfigs[lookupConfig.uri] = lookupConfig)
    }
    return lookupConfigs
  }, [propertyTemplate])

  useEffect(() => {
    setSelectedLookupConfigs(allLookupConfigs)
  }, [allLookupConfigs])

  useEffect(() => {
    if (!query) return

    // Clear the results.
    // No re-render, so change not visible to user.
    allResults.current = []

    // Cancel all current searches
    while (tokens.current.length > 0) {
      tokens.current.pop().cancel = true
    }

    // Create a token for this set of searches
    const token = { cancel: false }
    tokens.current.push(token)

    // resultPromises is an array of Promise<result>
    const resultPromises = props.getLookupResults(query, Object.values(selectedLookupConfigs))
    resultPromises.forEach((resultPromise) => {
      resultPromise.then((resultSet) => {
        // Only use these results if not cancelled.
        if (!token.cancel) {
          allResults.current.push(resultSet)
          // Changing state triggers re-render.
          setTriggerRender(resultSet)
        }
      })
    })
  }, [props, query, selectedLookupConfigs])

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

  const isRepeatable = booleanPropertyFromTemplate(propertyTemplate, 'repeatable', true)

  const isDisabled = selected?.length > 0 && !isRepeatable

  const selectionChanged = (items) => {
    const payload = {
      id: propertyTemplate.propertyURI,
      items,
      reduxPath: props.reduxPath,
    }
    changeSelections(payload)
  }

  // Don't render if no property template yet
  if (!propertyTemplate) {
    return null
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

  const lookupCheckboxes = Object.values(allLookupConfigs).map((lookupConfig) => {
    const id = `${props.reduxPath.join()}-${lookupConfig.uri}`
    return (
      <div key={lookupConfig.uri} className="form-check">
        <input className="form-check-input"
               type="checkbox"
               id={id}
               checked={!!selectedLookupConfigs[lookupConfig.uri]}
               onChange={() => toggleLookup(lookupConfig.uri)} />
        <label className="form-check-label" htmlFor={id}>
          {lookupConfig.label}
        </label>
      </div>
    ) })

  const typeaheadProps = {
    id: 'lookupComponent',
    multiple: true,
    placeholder: propertyTemplate.propertyLabel,
    useCache: true,
    selectHintOnEnter: true,
    isLoading: false,
    allowNew: true,
    delay: 300,
    onKeyDown,
  }

  let error
  let groupClasses = 'form-group'

  if (displayValidations && !_.isEmpty(errors)) {
    groupClasses += ' has-error'
    error = errors.join(',')
  }
  return (
    <React.Fragment>
      {lookupCheckboxes.length > 1 && lookupCheckboxes}
      <div className={groupClasses}>
        <AsyncTypeahead renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps, Object.values(selectedLookupConfigs))}
                        renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
                        disabled={isDisabled}
                        onChange={(newSelected) => selectionChanged(newSelected)}
                        options={props.getOptions(allResults.current)}
                        onSearch={setQuery}
                        selected={selected}
                        {...typeaheadProps}
                        filterBy={() => true}
                        ref={(ref) => typeAheadRef.current = ref}
        />
        {error && <span className="text-danger">{error}</span>}
      </div>
    </React.Fragment>
  )
}

InputLookup.propTypes = {
  reduxPath: PropTypes.arrayOf(PropTypes.string).isRequired,
  getLookupResults: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
}

export default InputLookup
