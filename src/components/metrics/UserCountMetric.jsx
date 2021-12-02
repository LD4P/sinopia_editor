// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"

const UserCountMetric = () => {
  const userCountMetric = useMetric("getUserCount")

  return (
    <CountCard
      count={userCountMetric?.count}
      title="User count"
      help="The total number of users."
    />
  )
}

export default UserCountMetric
