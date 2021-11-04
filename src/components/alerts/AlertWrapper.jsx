// Copyright 2019 Stanford University see LICENSE for license

import React, { forwardRef } from "react"
import PropTypes from "prop-types"

const AlertWrapper = forwardRef(({ children }, ref) => (
  <div ref={ref} className="row">
    <div className="col" style={{ marginTop: "10px" }}>
      <div className="alert alert-danger" role="alert">
        {children}
      </div>
    </div>
  </div>
))
AlertWrapper.displayName = "AlertWrapper"

AlertWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default AlertWrapper
