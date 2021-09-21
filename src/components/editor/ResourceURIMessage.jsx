// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectCurrentResourceKey, selectUri } from "selectors/resources"

// Renders the resource URI message for saved resource
const ResourceURIMessage = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const uri = useSelector((state) => selectUri(state, resourceKey))

  const [copyText, setCopyText] = useState("Copy URI")
  const [timerId, setTimerId] = useState(false)

  useEffect(() => () => {
    if (timerId) clearTimeout(timerId)
  })

  const handleClick = (event) => {
    navigator.clipboard.writeText(uri)
    setCopyText(<em>Copied URI to Clipboard</em>)
    setTimerId(setTimeout(() => setCopyText("Copy URI"), 3000))
    event.preventDefault()
  }

  if (!uri) {
    return null
  }

  return (
    <p>
      URI for this resource: &lt;{uri}&gt;&nbsp;
      <button
        type="button"
        className="btn btn-secondary btn-xs"
        onClick={handleClick}
      >
        {copyText}
      </button>
    </p>
  )
}

export default ResourceURIMessage
