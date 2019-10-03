// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'
import ExpiringMessage from './ExpiringMessage'

const SaveAlert = () => {
  const lastSave = useSelector(state => state.selectorReducer.editor.lastSave)

  return (
    <ExpiringMessage timestamp={lastSave}>
      Saved ...
    </ExpiringMessage>)
}

export default SaveAlert
