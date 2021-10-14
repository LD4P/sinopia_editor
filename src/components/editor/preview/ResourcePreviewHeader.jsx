// Copyright 2021 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"

const ResourcePreviewHeader = ({ resource }) => {
  const editableBy = [...resource.editGroups, resource.group]

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <h3>{resource.label}</h3>
        </div>
        <div className="col-10">
          <p>URI for this resource: &lt;{resource.uri}&gt;</p>
        </div>
        <div className="col-2">
          <strong>Owned by</strong>
          <p>{resource.group}</p>
          <strong>Editable by</strong>
          <p>{editableBy.join(", ")}</p>
        </div>
      </div>
    </React.Fragment>
  )
}

ResourcePreviewHeader.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default ResourcePreviewHeader
