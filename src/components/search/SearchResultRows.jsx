// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import usePermissions from "hooks/usePermissions"
import { selectGroupMap } from "selectors/groups"
import SearchResultRow from "./SearchResultRow"

/**
 * Generates HTML rows of all search results
 */
const SearchResultRows = ({ searchResults }) => {
  const { canEdit, canCreate } = usePermissions()
  const groupMap = useSelector((state) => selectGroupMap(state))

  return searchResults.map((row) => (
    <SearchResultRow
      key={row.uri}
      row={row}
      groupMap={groupMap}
      canCreate={canCreate}
      canEdit={canEdit(row)}
    />
  ))
}

SearchResultRows.propTypes = {
  searchResults: PropTypes.array.isRequired,
}

export default SearchResultRows
