// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { rootResourceId } from 'selectors/resourceSelectors'

// Renders the resource URI message for saved resource
const ResourceURIMessage = () => {
  const uri = useSelector(state => rootResourceId(state))
  const [copyText, setCopyText] = useState('Copy URI')

  if (!uri) {
    return null
  }

  const handleClick = (event) => {
    navigator.clipboard.writeText(uri)
    setCopyText(<em>Copied URI to Clipboard</em>)
    setTimeout(() => setCopyText('Copy URI'), 3000)
    event.preventDefault()
  }

  return (
    <div>
      <h4>URI for this resource: &lt;{ uri }&gt;&nbsp;
        <button type="button"
                className="btn btn-secondary btn-xs"
                onClick={ handleClick }>{ copyText }</button>
      </h4>
    </div>
  )
}

export default ResourceURIMessage
