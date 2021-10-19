// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import ActivePanelPropertyNav from "./ActivePanelPropertyNav"
import { selectCurrentPropertyKey } from "selectors/index"

const PanelResourceNav = (props) => {
  const currentPropertyKey = useSelector((state) => selectCurrentPropertyKey(state, props.resource?.key))
  const isTemplate = props.resource.subjectTemplateKey === "sinopia:template:resource"
  const classNames = ["resource-nav-list-group"]
  if (isTemplate) {
    classNames.push("template")
  }

  const navItems = props.resource.propertyKeys.map((propertyKey) => (
    <ActivePanelPropertyNav
      key={propertyKey}
      active={propertyKey === currentPropertyKey}
      propertyKey={propertyKey}
      isTemplate={isTemplate}
    />
  ))
  return (
    <div className="col-sm-4 left-nav">
      <div className={classNames.join(" ")} data-testid={classNames[1]}>
        <ul>{navItems}</ul>
      </div>
    </div>
  )
}

PanelResourceNav.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default PanelResourceNav
