// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import MetricsWrapper from "./MetricsWrapper"
import ResourceCountMetric from "./ResourceCountMetric"
import ResourceCreatedCountMetric from "./ResourceCreatedCountMetric"

const ResourceMetrics = ({ triggerHandleOffsetMenu }) => (
  <MetricsWrapper
    triggerHandleOffsetMenu={triggerHandleOffsetMenu}
    title="Resource metrics"
  >
    <div className="row mb-4">
      <div className="col-md-3">
        <ResourceCountMetric />
      </div>
    </div>
    <div className="row">
      <div className="col-md-3">
        <ResourceCreatedCountMetric />
      </div>
    </div>
  </MetricsWrapper>
)

ResourceMetrics.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default ResourceMetrics
