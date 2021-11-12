// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import PropertyLabelInfoLink from "./PropertyLabelInfoLink"
import PropertyLabelInfoTooltip from "./PropertyLabelInfoTooltip"

import _ from "lodash"

const PropertyLabelInfo = ({ propertyTemplate }) => (
  <React.Fragment>
    {!_.isEmpty(propertyTemplate.remark) && (
      <PropertyLabelInfoTooltip propertyTemplate={propertyTemplate} />
    )}
    {!_.isEmpty(propertyTemplate.remarkUrl) && (
      <PropertyLabelInfoLink propertyTemplate={propertyTemplate} />
    )}
  </React.Fragment>
)

PropertyLabelInfo.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfo
