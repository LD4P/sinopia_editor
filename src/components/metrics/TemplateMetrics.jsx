// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import MetricsWrapper from "./MetricsWrapper"
import TemplateCountMetric from "./TemplateCountMetric"
import TemplateCreatedCountMetric from "./TemplateCreatedCountMetric"
import TemplateEditedCountMetric from "./TemplateEditedCountMetric"

const TemplateMetrics = ({ triggerHandleOffsetMenu }) => (
  <MetricsWrapper
    triggerHandleOffsetMenu={triggerHandleOffsetMenu}
    title="Template metrics"
  >
    <div className="row mb-4">
      <div className="col-md-3">
        <TemplateCountMetric />
      </div>
    </div>
    <div className="row mb-4">
      <div className="col-md-3">
        <TemplateCreatedCountMetric />
      </div>
    </div>
    <div className="row">
      <div className="col-md-3">
        <TemplateEditedCountMetric />
      </div>
    </div>
  </MetricsWrapper>
)

TemplateMetrics.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default TemplateMetrics
