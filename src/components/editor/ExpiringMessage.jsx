// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import PropTypes from "prop-types"

const ExpiringMessage = ({ timestamp, children, scroll = true }) => {
  const [prevLastSave, setPrevLastSave] = useState(timestamp)
  const inputRef = useRef(null)

  useEffect(
    () =>
      function cleanup() {
        if (timer !== undefined) {
          clearInterval(timer)
        }
      }
  )

  useLayoutEffect(() => {
    if (!scroll || !timestamp) return
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [scroll, timestamp])

  if (!timestamp || prevLastSave === timestamp) {
    return null
  }

  const timer = setInterval(() => setPrevLastSave(timestamp), 3000)

  return (
    <div className="alert alert-success" ref={inputRef}>
      {children}
    </div>
  )
}

ExpiringMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  timestamp: PropTypes.number,
  scroll: PropTypes.bool,
}

export default ExpiringMessage
