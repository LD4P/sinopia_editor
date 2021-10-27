// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import PropertyLabelInfoLink from "./PropertyLabelInfoLink"
import PropertyLabelInfoTooltip from "./PropertyLabelInfoTooltip"

import _ from "lodash"

const PropertyLabelInfo = (props) => (
  <React.Fragment>
    {!_.isEmpty(props.propertyTemplate.remark) && (
      <PropertyLabelInfoTooltip {...props} />
    )}
    {!_.isEmpty(props.propertyTemplate.remarkUrl) && (
      <PropertyLabelInfoLink {...props} />
    )}
  </React.Fragment>
)

PropertyLabelInfo.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfo
