// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { isBfWork, isBfInstance, isBfItem } from "utilities/Bibframe"

/**
 * Shows the resources title
 */
const ResourceTitle = ({ resource }) => {
  let badge = null
  if (isBfWork(resource.classes)) badge = "WORK"
  if (isBfInstance(resource.classes)) badge = "INSTANCE"
  if (isBfItem(resource.classes)) badge = "ITEM"

  return (
    <React.Fragment>
      <span className="resource-label">{resource.label}</span>
      {badge && <span className="badge bg-secondary ms-2">{badge}</span>}
    </React.Fragment>
  )
}

ResourceTitle.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default ResourceTitle
