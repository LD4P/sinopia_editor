// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


const SaveAlert = (props) => {
  const [prevLastSave, setPrevLastSave] = useState(props.lastSave)

  useEffect(() => function cleanup() {
    if (timer !== undefined) {
      clearInterval(timer)
    }
  })

  if (!props.lastSave || prevLastSave === props.lastSave) {
    return null
  }

  // SkipTime is to help with testing.
  let timer
  if (!props.skipTimer) {
    timer = setInterval(() => setPrevLastSave(props.lastSave), 3000)
  }

  return (
    <div>
      <div className="alert alert-success" role="alert">
        Saved & Published ...
      </div>
    </div>)
}

SaveAlert.propTypes = {
  lastSave: PropTypes.number,
  skipTimer: PropTypes.bool,
}

const mapStateToProps = state => ({
  lastSave: state.selectorReducer.editor.lastSave,
})

export default connect(mapStateToProps)(SaveAlert)
