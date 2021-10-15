// Copyright 2019 Stanford University see LICENSE for license
import React from "react"
import SearchFilter from "./SearchFilter"

const TypeFilter = () => (
  <SearchFilter
    label="Filter by class"
    facet="types"
    filterSearchOption="typeFilter"
  />
)

export default TypeFilter
