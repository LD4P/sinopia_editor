// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"

const ResourceCountMetric = () => {
  const resourceCountMetric = useMetric("getResourceCount")

  return <CountCard count={resourceCountMetric?.count} title="Resource count" />
}

export default ResourceCountMetric
