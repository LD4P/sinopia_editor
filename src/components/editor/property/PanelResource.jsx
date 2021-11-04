// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import PanelProperty from "./PanelProperty"
import LeftNav from "../leftNav/LeftNav"

// Top-level resource
const PanelResource = ({ resource, readOnly = false }) => {
  const resourceDivClass = readOnly ? "col-md-12" : "col-md-7 col-lg-8 col-xl-9"
  const isTemplate = resource.subjectTemplateKey === "sinopia:template:resource"

  return (
    <div className="row">
      {!readOnly && <LeftNav resource={resource} />}
      <div className={resourceDivClass}>
        <form>
          {resource.propertyKeys.map((propertyKey, index) => (
            <PanelProperty
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
