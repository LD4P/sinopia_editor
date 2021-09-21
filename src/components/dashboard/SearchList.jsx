// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import SearchRow from "./SearchRow"
import useSearch from "hooks/useSearch"
import { useHistory } from "react-router-dom"
import { selectSearchQuery } from "selectors/search"

/**
 * This is the list view of searches
 */
const SearchList = (props) => {
  const { fetchNewSearchResults } = useSearch()
  const [navigateSearch, setNavigateSearch] = useState(false)
  const query = useSelector((state) => selectSearchQuery(state, "resource"))
  const history = useHistory()

  // Need to wait until results before navigating
  useEffect(() => {
    if (navigateSearch && query) history.push("/search")
  }, [navigateSearch, query, history])

  const handleSearch = (queryString, uri, event) => {
    event.preventDefault()
    fetchNewSearchResults(queryString, uri)
    setNavigateSearch(true)
  }

  const rows = props.searches.map((row) => (
    <SearchRow
      row={row}
      key={`${row.authorityUri}-${row.query}`}
      handleSearch={handleSearch}
    />
  ))

  return (
    <div className="row">
      <div className="col">
        <table className="table table-bordered table-sm search-list">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Authority</th>
              <th style={{ width: "66%" }}>Query</th>
              <th style={{ width: "4%" }} data-testid="action-col-header"></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  )
}

SearchList.propTypes = {
  searches: PropTypes.array,
}

export default SearchList
