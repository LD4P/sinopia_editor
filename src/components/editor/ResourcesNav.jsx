// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import {
  selectCurrentResourceKey,
  selectResourceKeys,
} from "selectors/resources"
import ResourcesNavTab from "./ResourcesNavTab"

const ResourcesNav = () => {
  const currentResourceKey = useSelector((state) =>
    selectCurrentResourceKey(state)
  )
  const resourceKeys = useSelector((state) => selectResourceKeys(state))

  const navTabs = resourceKeys.map((resourceKey) => (
    <ResourcesNavTab
      key={resourceKey}
      resourceKey={resourceKey}
      active={resourceKey === currentResourceKey}
    />
  ))

  if (resourceKeys.length === 1) return null

  return (
    <div className="row">
      <div className="col">
        <ul className="nav nav-tabs resources-nav-tabs">{navTabs}</ul>
      </div>
    </div>
  )
}

export default ResourcesNav
