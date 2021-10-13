// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import PanelProperty from "./PanelProperty"
import PanelResourceNav from "components/editor/leftNav/PanelResourceNav"

// Top-level resource
const PanelResource = ({ resource, readOnly = false }) => {
  const resourceDivClass = readOnly ? "col-sm-12" : "col-sm-9"
  const isTemplate = resource.subjectTemplateKey === "sinopia:template:resource"

  return (
    <div className="row">
      {!readOnly && <PanelResourceNav resource={resource} />}
      <div className={resourceDivClass}>
        <form>
          {resource.propertyKeys.map((propertyKey, index) => (
            <PanelProperty
              resourceKey={resource.key}
              propertyKey={propertyKey}
              isTemplate={isTemplate}
              key={propertyKey}
              float={index}
              id={propertyKey}
              readOnly={readOnly}
            />
          ))}
        </form>
      </div>
    </div>
  )
}

PanelResource.propTypes = {
  resource: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
}

export default PanelResource
