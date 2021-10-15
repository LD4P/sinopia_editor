// Copyright 2019 Stanford University see LICENSE for license
import React from "react"
import { useSelector } from "react-redux"
import { selectGroupMap } from "selectors/groups"
import SearchFilter from "./SearchFilter"

const GroupFilter = () => {
  const groupMap = useSelector((state) => selectGroupMap(state))

  const filterLabelFunc = (key) => groupMap[key] || "Unknown"

  return (
    <SearchFilter
      label="Filter by group"
      facet="groups"
      filterLabelFunc={filterLabelFunc}
      filterSearchOption="groupFilter"
    />
  )
}

export default GroupFilter
