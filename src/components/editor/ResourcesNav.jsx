// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import CloseButton from "./actions/CloseButton"
import { selectCurrentResourceKey, selectResourceKeys, selectNormSubject } from "selectors/resources"
import { setCurrentResource } from "actions/resources"

const ResourcesNav = () => {
  const dispatch = useDispatch()

  const currentResourceKey = useSelector((state) => selectCurrentResourceKey(state))

  const resourceKeys = useSelector((state) => selectResourceKeys(state))

  const navLabels = useSelector((state) => {
    const labels = {}
    resourceKeys.forEach((resourceKey) => {
      const resourceLabel = selectNormSubject(state, resourceKey).label
      labels[resourceKey] = resourceLabel.length > 38 ? `${resourceLabel.slice(0, 38)}...` : resourceLabel
    })
    return labels
  })

  const createResourceTemplateNavItem = (resourceKey, active) => {
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
            <div className="col" style={{ padding: "0px" }}>
              <a
                className="nav-link"
                href="#resourceTemplate"
                onClick={(event) => handleResourceNavClick(event, resourceKey)}
              >
                {navLabels[resourceKey]}
              </a>
            </div>
            {closeButton}
          </div>
        </div>
      </li>
    )
  }

  const generateNavItems = () =>
    resourceKeys.map((resourceKey) => createResourceTemplateNavItem(resourceKey, resourceKey === currentResourceKey))
  const resourceTemplateNavItems = resourceKeys.length > 1 ? generateNavItems() : []

  const handleResourceNavClick = (event, resourceKey) => {
    event.preventDefault()
    dispatch(setCurrentResource(resourceKey))
  }

  if (resourceTemplateNavItems.length === 0) return null

  return (
    <div className="row">
      <div className="col">
        <ul className="nav nav-tabs resources-nav-tabs">{resourceTemplateNavItems}</ul>
      </div>
    </div>
  )
}

export default ResourcesNav
