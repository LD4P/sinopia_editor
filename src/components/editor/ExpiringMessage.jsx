// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import PropTypes from "prop-types"

const ExpiringMessage = (props) => {
  const [prevLastSave, setPrevLastSave] = useState(props.timestamp)
  const inputRef = useRef(null)

  useEffect(
    () =>
      function cleanup() {
        if (timer !== undefined) {
          clearInterval(timer)
        }
      }
  )

  useLayoutEffect(() =>
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  )

  if (!props.timestamp || prevLastSave === props.timestamp) {
    return null
  }

  const timer = setInterval(() => setPrevLastSave(props.timestamp), 3000)

  return (
    <div className="alert alert-success" ref={inputRef}>
      {props.children}
    </div>
  )
}

ExpiringMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  timestamp: PropTypes.number,
}

export default ExpiringMessage
