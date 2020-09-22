// Copyright 2019 Stanford University see LICENSE for license
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSinopiaSearchResults } from 'actionCreators/search'
import {
  selectSearchOptions, selectSearchQuery,
  selectSearchFacetResults,
} from 'selectors/search'
import _ from 'lodash'
import { groupNameFromGroup } from 'utilities/Utilities'

const GroupFilter = () => {
  const dispatch = useDispatch()
  const query = useSelector((state) => selectSearchQuery(state, 'resource'))
  const searchOptions = useSelector((state) => selectSearchOptions(state, 'resource'))
  const groupFacetResults = useSelector((state) => selectSearchFacetResults(state, 'resource', 'groups'))
  const [groupFilterShowDropdown, setGroupFilterShowDropdown] = useState(false)
  const [selectedGroupFilters, setSelectedGroupFilters] = useState([])

  useEffect(() => {
    if (_.isEmpty(groupFacetResults)) return
    setSelectedGroupFilters(groupFacetResults.map((result) => result.key))
  }, [groupFacetResults])

  const handleFilter = () => {
    dispatch(fetchSinopiaSearchResults(query, { ...searchOptions, startOfRange: 0, groupFilter: selectedGroupFilters }))
    setGroupFilterShowDropdown(false)
  }

  const clearFilter = () => {
    dispatch(fetchSinopiaSearchResults(query, { ...searchOptions, startOfRange: 0, groupFilter: undefined }))
    setGroupFilterShowDropdown(false)
  }

  const handleOnly = (type) => {
    setSelectedGroupFilters([type])
  }

  const toggleSelectedGroupFilter = (toggleType) => {
    if (selectedGroupFilters.includes(toggleType)) {
      setSelectedGroupFilters(selectedGroupFilters.filter((type) => type !== toggleType))
    } else {
      setSelectedGroupFilters([...selectedGroupFilters, toggleType])
    }
  }

  if (_.isEmpty(groupFacetResults)) return null

  // Need to use anchor because cannot put a button in a button.
  /* eslint-disable jsx-a11y/anchor-is-valid */
  const groupItems = groupFacetResults.map((result) => {
    const id = `groupFilterDropdown-${result.key}`
    return (
      <button type="button" className="dropdown-item" href="#" key={result.key}>
        <input className="form-check-input"
               type="checkbox"
               value=""
               id={id}
               checked={selectedGroupFilters.includes(result.key)}
               onChange={() => toggleSelectedGroupFilter(result.key)}/>
        <label className="form-check-label" htmlFor={id}>
          {groupNameFromGroup(result.key)} ({result.doc_count})
        </label>
        &nbsp;&nbsp;
        <a href="#" onClick={() => handleOnly(result.key)}>Only</a>
      </button>
    )
  })


  const dropDownMenuClasses = ['dropdown-menu']
  if (groupFilterShowDropdown) dropDownMenuClasses.push('show')
  return (
    <div className="btn-group" role="group" aria-label="Filter by institution" style={{ marginLeft: '10px' }}>
      <div className="btn-group" role="group">
        <div className="dropdown">
          <button className="btn btn-secondary"
                  type="button"
                  id="groupFilterDropdownButton"
                  aria-haspopup="true"
                  aria-expanded={groupFilterShowDropdown}
                  onClick={() => setGroupFilterShowDropdown(!groupFilterShowDropdown)} >
            Filter by institution
          </button>
          <div className={dropDownMenuClasses.join(' ')} aria-labelledby="groupFilterDropdownButton">
            {searchOptions.groupFilter
                && <button type="button" className="dropdown-item" href="#" key="clear" onClick={() => clearFilter()}>
                  Clear filter
                </button>
            }
            {groupItems}
          </div>
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={() => handleFilter()}>Go</button>
    </div>
  )
}

export default GroupFilter
