// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"
import GroupFilter, { defaultGroup } from "./GroupFilter"
import DateRangeFilter, {
  defaultStartDate,
  defaultEndDate,
} from "./DateRangeFilter"

const TemplateCreatedCountMetric = () => {
  const [params, setParams] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    group: defaultGroup,
  })

  const templateCreatedCountMetric = useMetric(
    "getTemplateCreatedCount",
    params
  )

  const footer = (
    <React.Fragment>
      <DateRangeFilter params={params} setParams={setParams} />
      <GroupFilter params={params} setParams={setParams} />
    </React.Fragment>
  )

  return (
    <CountCard
      count={templateCreatedCountMetric?.count}
      title="Template creation"
      footer={footer}
    />
  )
}

export default TemplateCreatedCountMetric
