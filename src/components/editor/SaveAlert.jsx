// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'


const SaveAlert = (props) => {
  const lastSave = useSelector(state => state.selectorReducer.editor.lastSave)
  const [prevLastSave, setPrevLastSave] = useState(lastSave)

  useEffect(() => function cleanup() {
    if (timer !== undefined) {
      clearInterval(timer)
    }
  })

  if (!lastSave || prevLastSave === lastSave) {
    return null
  }

  // SkipTime is to help with testing.
  let timer
  if (!props.skipTimer) {
    timer = setInterval(() => setPrevLastSave(lastSave), 3000)
  }

  return (
    <div>
      <div className="alert alert-success" role="alert">
        Saved & Published ...
      </div>
    </div>)
}

SaveAlert.propTypes = {
  skipTimer: PropTypes.bool,
}

export default SaveAlert
