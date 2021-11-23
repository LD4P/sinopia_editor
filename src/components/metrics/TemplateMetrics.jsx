// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import MetricsWrapper from "./MetricsWrapper"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"

const TemplateMetrics = ({ triggerHandleOffsetMenu }) => {
  const templateCountMetric = useMetric("getTemplateCount")

  return (
    <MetricsWrapper
      triggerHandleOffsetMenu={triggerHandleOffsetMenu}
      title="Template metrics"
    >
      <div className="row">
        <div className="col-md-3">
          {templateCountMetric?.count && (
            <CountCard
              count={templateCountMetric?.count}
              title="Template count"
            />
          )}
        </div>
      </div>
    </MetricsWrapper>
  )
}

TemplateMetrics.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default TemplateMetrics
