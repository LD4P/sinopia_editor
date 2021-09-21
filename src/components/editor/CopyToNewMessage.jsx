// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import ExpiringMessage from "./ExpiringMessage"
import {
  selectCopyToNewMessageOldUri,
  selectCopyToNewMessageTimestamp,
} from "selectors/messages"

const CopyToNewMessage = () => {
  const oldUri = useSelector((state) => selectCopyToNewMessageOldUri(state))
  const timestamp = useSelector((state) =>
    selectCopyToNewMessageTimestamp(state)
  )

  return (
    <ExpiringMessage timestamp={timestamp}>
      Copied {oldUri} to new resource.
    </ExpiringMessage>
  )
}

export default CopyToNewMessage
