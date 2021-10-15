// Copyright 2021 Stanford University see LICENSE for license

import React, { useState } from "react"
import PropTypes from "prop-types"
import ResourceURIMessage from "../ResourceURIMessage"

const ResourcePreviewHeader = ({ resource }) => {
  const editableBy = [...resource.editGroups, resource.group].join(", ") // the creator can also edit!
  const maxGroupDisplay = 20
  const shouldTruncate = editableBy.length > maxGroupDisplay
  const [isCollapsed, setIsCollapsed] = useState(shouldTruncate)
  const editableByText = isCollapsed
    ? editableBy.slice(0, maxGroupDisplay - 1)
    : editableBy

  const handleClick = (event) => {
    event.preventDefault
    setIsCollapsed(false)
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <h3>{resource.label}</h3>
        </div>
        <div className="col-10">
          <ResourceURIMessage resourceKey={resource.key} />
        </div>
        <div className="col-2">
          <strong>Owned by</strong>
          <p>{resource.group}</p>
          <strong>Editable by</strong>
          <p>
            {editableByText}
            {isCollapsed && (
              <button className="p-0 btn btn-link" onClick={handleClick}>
                ...
              </button>
            )}
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

ResourcePreviewHeader.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default ResourcePreviewHeader
