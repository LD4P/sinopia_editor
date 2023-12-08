// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import ExpiringMessage from "./ExpiringMessage"
import { selectCurrentResourceKey, selectLastSave } from "selectors/resources"

const SaveAlert = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const lastSave = useSelector((state) => selectLastSave(state, resourceKey))

  return (
    <ExpiringMessage timestamp={lastSave} scroll={false}>
      Saved
    </ExpiringMessage>
  )
}

export default SaveAlert
