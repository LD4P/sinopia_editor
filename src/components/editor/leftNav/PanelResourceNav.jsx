// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import ActivePanelPropertyNav from "./ActivePanelPropertyNav"

const PanelResourceNav = (props) => {
  const isTemplate =
    props.resource.subjectTemplateKey === "sinopia:template:resource"
  const classNames = ["resource-nav-list-group"]
  if (isTemplate) {
    classNames.push("template")
  }

  const navItems = props.resource.propertyKeys.map((propertyKey) => (
    <ActivePanelPropertyNav
      key={propertyKey}
      propertyKey={propertyKey}
      isTemplate={isTemplate}
    />
  ))
  return (
    <div className={classNames.join(" ")} data-testid={classNames[1]}>
      <ul>{navItems}</ul>
    </div>
  )
}

PanelResourceNav.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default PanelResourceNav
