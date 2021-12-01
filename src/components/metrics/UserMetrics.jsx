// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import MetricsWrapper from "./MetricsWrapper"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"

const UserMetrics = ({ triggerHandleOffsetMenu }) => {
  const userCountMetric = useMetric("getUserCount")

  return (
    <MetricsWrapper
      triggerHandleOffsetMenu={triggerHandleOffsetMenu}
      title="User metrics"
    >
      <div className="row">
        <div className="col-md-3">
          {userCountMetric?.count && (
            <CountCard
              count={userCountMetric?.count}
              title="User count"
              help="The total number of users."
            />
          )}
        </div>
      </div>
    </MetricsWrapper>
  )
}

UserMetrics.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default UserMetrics
