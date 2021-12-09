// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClipboard,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons"

const ClipboardButton = ({ text, label = null }) => {
  const [isCopying, setCopying] = useState(false)
  const [timerId, setTimerId] = useState(false)

  useEffect(() => () => {
    if (timerId) clearTimeout(timerId)
  })

  const handleClick = (event) => {
    navigator.clipboard.writeText(text)
    setCopying(true)
    setTimerId(setTimeout(() => setCopying(false), 1000))
    event.preventDefault()
  }

  if (!text) {
    return null
  }

  if (isCopying)
    return (
      <button
        type="button"
        className="btn btn-sm"
        aria-label={`Copied ${label} to clipboard`}
        data-testid={`Copied ${label} to clipboard`}
      >
        <FontAwesomeIcon className="info-icon" icon={faClipboardCheck} />{" "}
        Copied!
      </button>
    )

  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      aria-label={`Copy ${label} to clipboard`}
      data-testid={`Copy ${label} to clipboard`}
      onClick={handleClick}
    >
      <FontAwesomeIcon className="info-icon" icon={faClipboard} /> Copy {label}
    </button>
  )
}

ClipboardButton.propTypes = {
  text: PropTypes.string,
  label: PropTypes.string.isRequired,
}

export default ClipboardButton
