// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import MetricsWrapper from "./MetricsWrapper"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"

const ResourceMetrics = ({ triggerHandleOffsetMenu }) => {
  const resourceCountMetric = useMetric("getResourceCount")

  return (
    <MetricsWrapper
      triggerHandleOffsetMenu={triggerHandleOffsetMenu}
      title="Resource metrics"
    >
      <div className="row">
        <div className="col-md-3">
          {resourceCountMetric?.count && (
            <CountCard
              count={resourceCountMetric?.count}
              title="Resource count"
            />
          )}
        </div>
      </div>
    </MetricsWrapper>
  )
}

ResourceMetrics.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default ResourceMetrics
