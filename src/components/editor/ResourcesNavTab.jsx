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

  const handleResourceNavClick = (event) => {
    event.preventDefault()
    dispatch(setCurrentResource(resourceKey))
  }

  const itemClasses = ["nav-item"]
  let closeButton
  if (active) {
    itemClasses.push("active")
  } else {
    closeButton = (
      <CloseButton
        css={"btn-close pull-right mt-1"}
        resourceKey={resourceKey}
      />
    )
  }

  return (
    <li className={itemClasses.join(" ")} key={resourceKey}>
      <a
        className="tab-link"
        href="#resourceTemplate"
        onClick={handleResourceNavClick}
      >
        {label}
      </a>

      {closeButton}
    </li>
  )
}

ResourcesNavTab.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
}

export default ResourcesNavTab
