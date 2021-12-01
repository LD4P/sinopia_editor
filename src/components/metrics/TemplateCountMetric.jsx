// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"

const TemplateCountMetric = () => {
  const templateCountMetric = useMetric("getTemplateCount")

  return (
    <CountCard
      count={templateCountMetric?.count}
      title="Template count"
      help="The total number of templates."
    />
  )
}

export default TemplateCountMetric
