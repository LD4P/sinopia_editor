// Copyright 2019 Stanford University see LICENSE for license

import PropTypes from 'prop-types'
import React from 'react'

const Alert = (props) => {
  if (!props.text) {
    return null
  }

  return (
    <div className="row">
      <div className="col" style={{ marginTop: '10px' }}>
        <div className="alert alert-danger alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          { props.text }
        </div>
      </div>
    </div>
  )
}

Alert.propTypes = {
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
}

export default Alert
