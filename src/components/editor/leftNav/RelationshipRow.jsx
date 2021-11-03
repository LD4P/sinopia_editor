// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import usePermissions from "hooks/usePermissions"
import useResource from "hooks/useResource"
import CopyButton from "../../buttons/CopyButton"
import EditButton from "../../buttons/EditButton"
import ViewButton from "../../buttons/ViewButton"

const RelationshipRow = ({ errorKey, row, displayActions }) => {
  const { canEdit, canCreate } = usePermissions()
  const {
    handleCopy,
    handleEdit,
    handleView,
    isLoadingCopy,
    isLoadingEdit,
    isLoadingView,
  } = useResource(errorKey, { resourceURI: row.uri })

  return (
    <li>
      {row.label}
      {displayActions && (
        <div
          className="btn-group ps-3"
          role="group"
          aria-label="Result Actions"
        >
          <ViewButton
            handleClick={handleView}
            isLoading={isLoadingView}
            label={row.label}
          />
          {canEdit(row) && (
            <EditButton
              handleClick={handleEdit}
              isLoading={isLoadingEdit}
              label={row.label}
            />
          )}
          {canCreate && (
            <CopyButton
              handleClick={handleCopy}
              isLoading={isLoadingCopy}
              label={row.label}
            />
          )}
        </div>
      )}
    </li>
  )
}

RelationshipRow.propTypes = {
  row: PropTypes.object.isRequired,
  errorKey: PropTypes.string.isRequired,
  displayActions: PropTypes.bool.isRequired,
}

export default RelationshipRow
