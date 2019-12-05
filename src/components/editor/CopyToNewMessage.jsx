// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'
import ExpiringMessage from './ExpiringMessage'

const CopyToNewMessage = () => {
  const oldUri = useSelector((state) => state.selectorReducer.editor.copyToNewMessage.oldUri)
  const timestamp = useSelector((state) => state.selectorReducer.editor.copyToNewMessage.timestamp)

  return (
    <ExpiringMessage timestamp={timestamp}>
      Copied {oldUri} to new resource.
    </ExpiringMessage>)
}

export default CopyToNewMessage
