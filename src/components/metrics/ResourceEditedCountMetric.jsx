// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"
import GroupFilter, { defaultGroup } from "./GroupFilter"
import DateRangeFilter, {
  defaultStartDate,
  defaultEndDate,
} from "./DateRangeFilter"

const ResourceEditedCountMetric = () => {
  const [params, setParams] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    group: defaultGroup,
  })

  const resourceEditedCountMetric = useMetric("getResourceEditedCount", params)

  const footer = (
    <React.Fragment>
      <DateRangeFilter params={params} setParams={setParams} />
      <GroupFilter params={params} setParams={setParams} />
    </React.Fragment>
  )

  return (
    <CountCard
      count={resourceEditedCountMetric?.count}
      title="Resource editing"
      help="The total number of resources (excluding templates) created or edited in a specified time period, optionally filtered by group."
      footer={footer}
    />
  )
}

export default ResourceEditedCountMetric
