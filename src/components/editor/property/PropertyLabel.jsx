// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import RequiredSuperscript from "./RequiredSuperscript"

const PropertyLabel = ({ label, required }) => (
  <React.Fragment>
    <span>{label}</span>
    {required && <RequiredSuperscript />}
  </React.Fragment>
)

PropertyLabel.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
}

export default PropertyLabel
