// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import CloseButton from "./actions/CloseButton"
import { selectPickSubject } from "selectors/resources"
import { setCurrentResource } from "actions/resources"
import ResourceTitle from "./ResourceTitle"

const ResourcesNavTab = ({ resourceKey, active }) => {
  const dispatch = useDispatch()

  const resource = useSelector((state) =>
    selectPickSubject(state, resourceKey, ["label", "classes"])
  )

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
        <ResourceTitle resource={resource} />
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
