// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useEffect, useMemo, useRef,
} from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import defaultFilterBy from 'react-bootstrap-typeahead/lib/utils/defaultFilterBy'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { renderMenuFunc, renderTokenFunc, itemsForProperty } from './renderTypeaheadFunctions'
import { fetchLookup } from 'actionCreators/lookups'
import { selectLookup } from 'selectors/lookups'
import { selectProperty } from 'selectors/resources'
import _ from 'lodash'
import { replaceValues, clearValues } from 'actions/resources'
import { newUriValue, newLiteralValue } from 'utilities/valueFactory'

// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on URI in propertyTemplate.valueConstraint.useValuesFrom,
//  and the lookupConfig for the URI has component value of 'list'
const InputListLOC = (props) => {
  const dispatch = useDispatch()
  // const changeSelections = (payload) => dispatch(changeSelectionsAction(payload))
  const property = useSelector((state) => selectProperty(state, props.propertyKey))

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

  const isRepeatable = property.propertyTemplate.repeatable

  useEffect(() => {
    property.propertyTemplate.authorities.forEach((authority) => {
      dispatch(fetchLookup(authority.uri))
    })
  }, [dispatch, property.propertyTemplate.authorities])

  const authorities = useSelector((state) => {
    const newAuthorities = {}
    property.propertyTemplate.authorities.forEach((authority) => {
      newAuthorities[authority.uri] = selectLookup(state, authority.uri) || []
    })
    return newAuthorities
  })

  // Only update options when lookups or lookupConfigs change.
  const options = useMemo(() => {
    const newOptions = []
    Object.values(selectedAuthorities).forEach((authority) => {
      newOptions.push({ authLabel: authority.label, authURI: authority.uri })
      newOptions.push(...authorities[authority.uri] || [])
    })
    return newOptions
  }, [authorities, selectedAuthorities])

  const selected = itemsForProperty(property)

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

  const lookupCheckboxes = property.propertyTemplate.authorities.map((authority) => {
    const id = `${property.key}-${authority.uri}`
    return (
      <div key={authority.uri} className="form-check">
        <input className="form-check-input"
               type="checkbox" id={id}
               checked={!!selectedAuthorities[authority.uri]}
               onChange={() => toggleLookup(authority.uri)} />
        <label className="form-check-label" htmlFor={id}>
          {authority.label}
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
    const newSelectedAuthorities = { ...selectedAuthorities }
    if (newSelectedAuthorities[uri]) {
      delete newSelectedAuthorities[uri]
    } else {
      newSelectedAuthorities[uri] = allAuthorities[uri]
    }
    setSelectedAuthorities(newSelectedAuthorities)
    typeAheadRef.current.getInstance().getInput().click()
  }


  const displayValidations = useSelector((state) => displayResourceValidations(state))
  const validationErrors = property.errors

  const isDisabled = selected?.length > 0 && !isRepeatable

  let error
  let groupClasses = 'form-group'
  if (displayValidations && !_.isEmpty(validationErrors)) {
    groupClasses += ' has-error'
    error = validationErrors.join(',')
  }

  return (
    <React.Fragment>
      {lookupCheckboxes.length > 1 && lookupCheckboxes}
      <div className={groupClasses}>
        <Typeahead
          renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps, Object.values(selectedAuthorities))}
          renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
          allowNew={() => true }
          onChange={(selected) => selectionChanged(selected)}
          id="loc-vocab-list"
          multiple={true}
          placeholder={property.propertyTemplate.propertyLabel}
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
  propertyKey: PropTypes.string.isRequired,
}

export default InputListLOC
