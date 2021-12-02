// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"
import DateRangeFilter, {
  defaultStartDate,
  defaultEndDate,
} from "./DateRangeFilter"

const UserResourceCountMetric = () => {
  const [params, setParams] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  })

  const userResourceCountMetric = useMetric("getResourceUserCount", params)

  const footer = (
    <React.Fragment>
      <DateRangeFilter params={params} setParams={setParams} />
    </React.Fragment>
  )

  return (
    <CountCard
      count={userResourceCountMetric?.count}
      title="User Resource Saved Count"
      help="The total number of unique users that saved at least one resource (excluding templates) in a specified time period."
      footer={footer}
    />
  )
}

export default UserResourceCountMetric
