// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import LongDate from "components/LongDate"
import ViewButton from "../buttons/ViewButton"
import EditButton from "../buttons/EditButton"
import CopyButton from "../buttons/CopyButton"
import useResource from "hooks/useResource"
import useAlerts from "hooks/useAlerts"

/**
 * Generates HTML row of all search results
 */
const SearchResultRow = ({ row, canEdit, canCreate, groupMap }) => {
  const errorKey = useAlerts()
  const {
    handleView,
    handleEdit,
    handleCopy,
    isLoadingView,
    isLoadingEdit,
    isLoadingCopy,
  } = useResource(errorKey, { resourceURI: row.uri })

  return (
    <tr key={row.uri}>
      <td>
        {row.label}
        {row.label !== row.uri && (
          <React.Fragment>
            <br />
            {row.uri}
          </React.Fragment>
        )}
      </td>
      <td>
        <ul className="list-unstyled">
          {row.type?.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </td>
      <td>{groupMap[row.group] || "Unknown"}</td>
      <td>
        <LongDate datetime={row.modified} />
      </td>
      <td>
        <div className="btn-group" role="group" aria-label="Result Actions">
          <ViewButton
            label={row.label}
            handleClick={handleView}
            isLoading={isLoadingView}
          />
          {canEdit && (
            <EditButton
              label={row.label}
              handleClick={handleEdit}
              isLoading={isLoadingEdit}
            />
          )}
          {canCreate && (
            <CopyButton
              label={row.label}
              handleClick={handleCopy}
              isLoading={isLoadingCopy}
            />
          )}
        </div>
      </td>
    </tr>
  )
}

SearchResultRow.propTypes = {
  row: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  canCreate: PropTypes.bool.isRequired,
  groupMap: PropTypes.object.isRequired,
}

export default SearchResultRow
