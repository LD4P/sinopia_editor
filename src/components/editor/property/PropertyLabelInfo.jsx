// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import PropertyLabelInfoLink from "./PropertyLabelInfoLink"
import PropertyLabelInfoTooltip from "./PropertyLabelInfoTooltip"

import _ from "lodash"

const renderInfoLink = (props) => {
  if (!_.isEmpty(props.propertyTemplate.remarkUrl)) {
    return <PropertyLabelInfoLink {...props} />
  }
  return null
}

const renderInfoTooltip = (props) => {
  if (!_.isEmpty(props.propertyTemplate.remark)) {
    return <PropertyLabelInfoTooltip {...props} />
  }
  return null
}

const PropertyLabelInfo = (props) => (
  <React.Fragment>
    {renderInfoTooltip(props)}
    {renderInfoLink(props)}
  </React.Fragment>
)

PropertyLabelInfo.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfo
