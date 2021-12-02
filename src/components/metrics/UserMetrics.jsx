// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import MetricsWrapper from "./MetricsWrapper"
import UserCountMetric from "./UserCountMetric"
import UserResourceCountMetric from "./UserResourceCountMetric"
import UserTemplateCountMetric from "./UserTemplateCountMetric"

const UserMetrics = ({ triggerHandleOffsetMenu }) => (
  <MetricsWrapper
    triggerHandleOffsetMenu={triggerHandleOffsetMenu}
    title="User metrics"
  >
    <div className="row mb-4">
      <div className="col-md-3">
        <UserCountMetric />
      </div>
    </div>
    <div className="row mb-4">
      <div className="col-md-3">
        <UserResourceCountMetric />
      </div>
    </div>
    <div className="row mb-4">
      <div className="col-md-3">
        <UserTemplateCountMetric />
      </div>
    </div>
  </MetricsWrapper>
)

UserMetrics.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default UserMetrics
