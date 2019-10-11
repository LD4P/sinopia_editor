// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'
import { rootResourceId } from 'selectors/resourceSelectors'

// Renders the resource URI message for saved resource
const ResourceURIMessage = () => {
  const uri = useSelector(state => rootResourceId(state))

  if (!uri) {
    return null
  }

  return (
    <div>
      <h4>URI for this resource: &lt;{ uri }&gt;&nbsp;
        <button type="button" className="btn btn-default btn-xs" onClick={() => { navigator.clipboard.writeText(uri) }}>Copy URI</button>
      </h4>
    </div>
  )
}

export default ResourceURIMessage
