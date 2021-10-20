// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import CloseButton from "./actions/CloseButton"
import { selectResourceLabel } from "selectors/resources"
import { setCurrentResource } from "actions/resources"

const ResourcesNavTab = ({ resourceKey, active }) => {
  const dispatch = useDispatch()

  const label = useSelector((state) => selectResourceLabel(state, resourceKey))
  const formattedLabel = label.length > 38 ? `${label.slice(0, 38)}...` : label

  const handleResourceNavClick = (event) => {
    event.preventDefault()
    dispatch(setCurrentResource(resourceKey))
  }

  const itemClasses = ["nav-item"]
  let closeButton
  if (active) {
    itemClasses.push("active")
  } else {
    closeButton = <CloseButton css={"btn-close"} resourceKey={resourceKey} />
  }

  return (
    <li className={itemClasses.join(" ")} key={resourceKey}>
      <div className="container">
        <div className="row">
          <div className="col p-0">
            <a
              className="nav-link"
              href="#resourceTemplate"
              onClick={handleResourceNavClick}
            >
              {formattedLabel}
            </a>
          </div>
          {closeButton}
        </div>
      </div>
    </li>
  )
}

ResourcesNavTab.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
}

export default ResourcesNavTab
