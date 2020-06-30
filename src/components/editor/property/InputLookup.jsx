// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useRef, useMemo, useEffect,
} from 'react'
import { Typeahead, asyncContainer } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import _ from 'lodash'
import { renderMenuFunc, renderTokenFunc, itemsForProperty } from './renderTypeaheadFunctions'
import { selectProperty } from 'selectors/resources'
import { newUriValue, newLiteralValue } from 'utilities/valueFactory'
import { clearValues, replaceValues } from 'actions/resources'


const AsyncTypeahead = asyncContainer(Typeahead)

const InputLookup = (props) => {
  const dispatch = useDispatch()
  const property = useSelector((state) => selectProperty(state, props.propertyKey))
  const [, setTriggerRender] = useState('')
  // Using a ref so that can append to current list of results.
  const allResults = useRef([])
  // Tokens allow us to cancel an existing search. Does not actually stop the
  // search, but causes result to be ignored.
  const tokens = useRef([])

  const displayValidations = useSelector((state) => displayResourceValidations(state))
  const errors = property.errors
  const selected = itemsForProperty(property)
  const [query, setQuery] = useState(false)
  const typeAheadRef = useRef(null)

  const allAuthorities = useMemo(() => {
    const authorities = {}
    property.propertyTemplate.authorities.forEach((authority) => authorities[authority.uri] = authority)
    return authorities
  }, [property.propertyTemplate.authorities])

  const [selectedAuthorities, setSelectedAuthorities] = useState({})

  useEffect(() => {
    setSelectedAuthorities(allAuthorities)
  }, [allAuthorities])

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
    const resultPromises = props.getLookupResults(query, Object.values(selectedAuthorities))
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
  }, [props, query, selectedAuthorities])

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

  const isRepeatable = property.propertyTemplate.repeatable

  const isDisabled = selected?.length > 0 && !isRepeatable

  const selectionChanged = (items) => {
    if (_.isEmpty(items)) {
      dispatch(clearValues(props.propertyKey))
    } else {
      const values = items.map((item) => {
        if (item.uri) {
          return newUriValue(props.propertyKey, item.uri, item.label)
        }
        return newLiteralValue(props.propertyKey, item.content, null)
      })
      dispatch(replaceValues(values))
    }
  }

  const toggleLookup = (uri) => {
    const newSelectedAuthorities = { ...selectedAuthorities }
    if (newSelectedAuthorities[uri]) {
      delete newSelectedAuthorities[uri]
    } else {
      newSelectedAuthorities[uri] = allAuthorities[uri]
    }
    setSelectedAuthorities(newSelectedAuthorities)
    typeAheadRef.current.getInstance().getInput().click()
  }

  const lookupCheckboxes = Object.values(allAuthorities).map((authority) => {
    const id = `${props.propertyKey}-${authority.uri}`
    return (
      <div key={authority.uri} className="form-check">
        <input className="form-check-input"
               type="checkbox"
               id={id}
               checked={!!selectedAuthorities[authority.uri]}
               onChange={() => toggleLookup(authority.uri)} />
        <label className="form-check-label" htmlFor={id}>
          {authority.label}
        </label>
      </div>
    ) })

  const typeaheadProps = {
    id: 'lookupComponent',
    multiple: true,
    placeholder: property.propertyTemplate.propertyLabel,
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
        <AsyncTypeahead renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps, Object.values(selectedAuthorities))}
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
  propertyKey: PropTypes.string.isRequired,
  getLookupResults: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
}

export default InputLookup
