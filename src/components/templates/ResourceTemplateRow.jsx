// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import LongDate from "components/LongDate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy, faEdit } from "@fortawesome/free-solid-svg-icons"
import usePermissions from "hooks/usePermissions"

/**
 * This is the list view of all the templates
 */
const ResourceTemplateRow = ({ row, handleClick, handleCopy, handleEdit }) => {
  const { canCreate, canEdit } = usePermissions()

  return (
    <tr key={row.id}>
      <td style={{ wordBreak: "break-all" }} data-testid="name">
        {canCreate ? (
          <Link
            to={{ pathname: "/editor", state: {} }}
            onClick={(e) => handleClick(row.id, e)}
          >
            {row.resourceLabel}
          </Link>
        ) : (
          <span>{row.resourceLabel}</span>
        )}
        <br />
        {row.id}
      </td>
      <td style={{ wordBreak: "break-all" }}>{row.resourceURI}</td>
      <td style={{ wordBreak: "break-all" }}>{row.author}</td>
      <td>
        <LongDate datetime={row.date} timeZone="UTC" />
      </td>
      <td style={{ wordBreak: "break-all" }}>{row.remark}</td>
      <td>
        <div className="btn-group" role="group" aria-label="Result Actions">
          {canEdit(row) && (
            <button
              type="button"
              className="btn btn-link"
              title="Edit"
              aria-label={`Edit ${row.resourceLabel}`}
              data-testid={`Edit ${row.resourceLabel}`}
              onClick={(e) => handleEdit(row.uri, e)}
            >
              <FontAwesomeIcon icon={faEdit} className="icon-lg" />
            </button>
          )}
          {canCreate && (
            <button
              type="button"
              className="btn btn-link"
              onClick={() => handleCopy(row.uri)}
              title="Copy"
              data-testid={`Copy ${row.resourceLabel}`}
              aria-label={`Copy ${row.resourceLabel}`}
            >
              <FontAwesomeIcon icon={faCopy} className="icon-lg" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

ResourceTemplateRow.propTypes = {
  row: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
}

export default ResourceTemplateRow
