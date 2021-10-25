// Copyright 2021 Stanford University see LICENSE for license

import React, { useState } from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import ResourceURIMessage from "../ResourceURIMessage"
import { selectGroupMap } from "selectors/groups"

const ResourcePreviewHeader = ({ resource }) => {
  const groupMap = useSelector((state) => selectGroupMap(state))
  const editableBy = resource.editGroups
    .map((group) => groupMap[group]) // look up the group name from the ID
    .filter((group) => group) // ditch any undefined group (an unmatched groupID for whatever reason)
    .join(", ")
  const maxGroupDisplay = 20
  // truncate the display and show ellipses if we have more than one edit group and all of them are too long
  const shouldTruncate =
    editableBy.length > maxGroupDisplay && resource.editGroups.length > 1
  const [isCollapsed, setIsCollapsed] = useState(shouldTruncate)
  const editableByText = isCollapsed
    ? editableBy.slice(0, maxGroupDisplay - 1)
    : editableBy

  const handleClick = (event) => {
    event.preventDefault()
    setIsCollapsed(false)
  }

  return (
    <React.Fragment>
      <div id="previewHeader" className="row">
        <div className="col-12">
          <h3>{resource.label}</h3>
        </div>
        <div className="col-10">
          <ResourceURIMessage resourceKey={resource.key} />
        </div>
        <div className="col-2">
          <strong>Owned/editable by</strong>
          <p>{groupMap[resource.group] || "Unknown"}</p>
          {resource.editGroups.length > 0 && (
            <>
              <strong>Also editable by</strong>
              <p>
                {editableByText}
                {isCollapsed && (
                  <button
                    data-testid="expand-groups-button"
                    className="p-0 btn btn-link"
                    onClick={handleClick}
                  >
                    ...
                  </button>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

ResourcePreviewHeader.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default ResourcePreviewHeader
