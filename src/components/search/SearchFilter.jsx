// Copyright 2019 Stanford University see LICENSE for license
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { fetchSinopiaSearchResults } from "actionCreators/search"
import {
  selectSearchOptions,
  selectSearchQuery,
  selectSearchFacetResults,
} from "selectors/search"
import useAlerts from "hooks/useAlerts"
import _ from "lodash"

const SearchFilter = ({
  label,
  filterLabelFunc,
  facet,
  filterSearchOption,
}) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const query = useSelector((state) => selectSearchQuery(state, "resource"))
  const searchOptions = useSelector((state) =>
    selectSearchOptions(state, "resource")
  )
  const facetResults = useSelector((state) =>
    selectSearchFacetResults(state, "resource", facet)
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState([])
  const [allSelected, setAllSelected] = useState(true)

  useEffect(() => {
    if (_.isEmpty(facetResults)) return
    setSelectedFilters(facetResults.map((result) => result.key))
    setAllSelected(true)
  }, [facetResults])

  const performFilter = (selectedFilters) => {
    dispatch(
      fetchSinopiaSearchResults(
        query,
        {
          ...searchOptions,
          startOfRange: 0,
          [filterSearchOption]: selectedFilters,
        },
        errorKey
      )
    )
  }

  const handleFilter = () => {
    performFilter(selectedFilters)
    setShowDropdown(false)
  }

  const clearFilter = () => {
    performFilter(null)
    setShowDropdown(false)
  }

  // toggle checkbox for an individual filter
  const toggleSelectedFilter = (event, toggleType) => {
    if (event.target?.type !== "checkbox") event.preventDefault()

    if (selectedFilters.includes(toggleType)) {
      setSelectedFilters(selectedFilters.filter((type) => type !== toggleType))
      setAllSelected(false)
    } else {
      const newSelectedFilters = [...selectedFilters, toggleType]
      setSelectedFilters(newSelectedFilters)
      if (newSelectedFilters.length === facetResults.length)
        setAllSelected(true)
    }
  }

  const toggleAllSelectedFilter = (event) => {
    if (event.target?.type !== "checkbox") event.preventDefault()

    if (allSelected) {
      // Deselect all
      setAllSelected(false)
      setSelectedFilters([])
    } else {
      // Select all
      setAllSelected(true)
      setSelectedFilters(facetResults.map((result) => result.key))
    }
  }

  if (_.isEmpty(facetResults)) return null

  // Disabling eslint rules is acceptable: linter complaint is about clickable labels.
  // However, the checkbox is still available for keyboard use.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

  // individual filters
  const dropdownItems = facetResults.map((result) => {
    const key = `${facet}FilterDropdown-${result.key}`
    return (
      <li key={key}>
        <button className="dropdown-item" type="button">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={key}
              checked={selectedFilters.includes(result.key)}
              onChange={(event) => toggleSelectedFilter(event, result.key)}
            />
            <label
              className="form-check-label"
              htmlFor={key}
              onClick={(event) => toggleSelectedFilter(event, result.key)}
            >
              {filterLabelFunc ? filterLabelFunc(result.key) : result.key} (
              {result.doc_count})
            </label>
          </div>
        </button>
      </li>
    )
  })

  const dropDownMenuClasses = ["dropdown-menu"]
  if (showDropdown) dropDownMenuClasses.push("show")
  const id = `${facet}FilterDropdownButton`

  // Select/Deselect all filter
  const allNoneItem = (
    <li key="allNone">
      <button className="dropdown-item" type="button">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`${id}-allNone`}
            checked={allSelected}
            onChange={toggleAllSelectedFilter}
          />
          <label
            className="form-check-label"
            htmlFor={`${id}-allNone`}
            onClick={toggleAllSelectedFilter}
          >
            Select/Deselect all
          </label>
        </div>
      </button>
    </li>
  )

  return (
    <div className="btn-group ms-2" role="group" aria-label={label}>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle btn-filter"
          type="button"
          id={id}
          aria-haspopup="true"
          aria-expanded={showDropdown}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {label}
        </button>
        <ul className={dropDownMenuClasses.join(" ")} aria-labelledby={id}>
          {allNoneItem}
          {dropdownItems}
          {searchOptions[filterSearchOption] && (
            <button
              type="button"
              className="dropdown-item"
              key="clear"
              onClick={() => clearFilter()}
            >
              Clear filter
            </button>
          )}
        </ul>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleFilter()}
      >
        Go
      </button>
    </div>
  )
}

SearchFilter.propTypes = {
  label: PropTypes.string.isRequired,
  filterLabelFunc: PropTypes.func,
  facet: PropTypes.string.isRequired,
  filterSearchOption: PropTypes.string.isRequired,
}

export default SearchFilter
