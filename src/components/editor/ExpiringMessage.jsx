// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const ExpiringMessage = (props) => {
  const [prevLastSave, setPrevLastSave] = useState(props.timestamp)

  useEffect(() => function cleanup() {
    if (timer !== undefined) {
      clearInterval(timer)
    }
  })

  if (!props.timestamp || prevLastSave === props.timestamp) {
    return null
  }

  const timer = setInterval(() => setPrevLastSave(props.timestamp), 3000)

  return (
    <div className="alert alert-success">
      {props.children}
    </div>
  )
}

ExpiringMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  timestamp: PropTypes.number,
}

export default ExpiringMessage
