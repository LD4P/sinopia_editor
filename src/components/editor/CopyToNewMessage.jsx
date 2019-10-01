// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'

const CopyToNewMessage = () => {
  const showMessage = useSelector(state => state.selectorReducer.editor.copyToNewMessage.show)
  const oldUri = useSelector(state => state.selectorReducer.editor.copyToNewMessage.oldUri)

  if (!showMessage) {
    return null
  }

  const stateOrUri = () => {
    if (oldUri !== undefined) {
      return oldUri
    }
  }

  return (
    <div className="alert alert-info alert-dismissible">
      <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
      Copied {stateOrUri()} to new resource.
    </div>
  )
}

export default CopyToNewMessage
