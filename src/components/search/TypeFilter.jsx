// Copyright 2019 Stanford University see LICENSE for license
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSinopiaSearchResults } from 'actionCreators/search'
import {
  selectSearchOptions, selectSearchQuery,
  selectSearchFacetResults,
} from 'selectors/search'
import _ from 'lodash'

const TypeFilter = () => {
  const dispatch = useDispatch()
  const query = useSelector((state) => selectSearchQuery(state, 'resource'))
  const searchOptions = useSelector((state) => selectSearchOptions(state, 'resource'))
  const typeFacetResults = useSelector((state) => selectSearchFacetResults(state, 'resource', 'types'))

  const [typeFilterShowDropdown, setTypeFilterShowDropdown] = useState(false)
  const [selectedTypeFilters, setSelectedTypeFilters] = useState([])

  useEffect(() => {
    if (_.isEmpty(typeFacetResults)) return
    setSelectedTypeFilters(typeFacetResults.map((result) => result.key))
  }, [typeFacetResults])

  const handleFilter = () => {
    dispatch(fetchSinopiaSearchResults(query, { ...searchOptions, startOfRange: 0, typeFilter: selectedTypeFilters }))
    setTypeFilterShowDropdown(false)
  }

  const clearFilter = () => {
    dispatch(fetchSinopiaSearchResults(query, { ...searchOptions, startOfRange: 0, typeFilter: undefined }))
    setTypeFilterShowDropdown(false)
  }

  const handleOnly = (type) => {
    setSelectedTypeFilters([type])
  }

  const toggleSelectedTypeFilter = (toggleType) => {
    if (selectedTypeFilters.includes(toggleType)) {
      setSelectedTypeFilters(selectedTypeFilters.filter((type) => type !== toggleType))
    } else {
      setSelectedTypeFilters([...selectedTypeFilters, toggleType])
    }
  }

  if (_.isEmpty(typeFacetResults)) return null

  // Need to use anchor because cannot put a button in a button.
  /* eslint-disable jsx-a11y/anchor-is-valid */
  const typeItems = typeFacetResults.map((result) => {
    const id = `typeFilterDropdown-${result.key}`
    return (
      <button type="button" className="dropdown-item" href="#" key={result.key}>
        <input className="form-check-input"
               type="checkbox"
               value=""
               id={id}
               checked={selectedTypeFilters.includes(result.key)}
               onChange={() => toggleSelectedTypeFilter(result.key)}/>
        <label className="form-check-label" htmlFor={id}>
          {result.key} ({result.doc_count})
        </label>
        &nbsp;&nbsp;
        <a href="#" onClick={() => handleOnly(result.key)}>Only</a>
      </button>
    )
  })


  const dropDownMenuClasses = ['dropdown-menu']
  if (typeFilterShowDropdown) dropDownMenuClasses.push('show')
  return (
    <div className="btn-group" role="group" aria-label="Filter by class">
      <div className="btn-group" role="group">
        <div className="dropdown">
          <button className="btn btn-secondary"
                  type="button"
                  id="typeFilterDropdownButton"
                  aria-haspopup="true"
                  aria-expanded={typeFilterShowDropdown}
                  onClick={() => setTypeFilterShowDropdown(!typeFilterShowDropdown)} >
            Filter by class
          </button>
          <div className={dropDownMenuClasses.join(' ')} aria-labelledby="typeFilterDropdownButton">
            {searchOptions.typeFilter
                && <button type="button" className="dropdown-item" href="#" key="clear" onClick={() => clearFilter()}>
                  Clear filter
                </button>
            }
            {typeItems}
          </div>
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={() => handleFilter()}>Go</button>
    </div>
  )
}

export default TypeFilter
