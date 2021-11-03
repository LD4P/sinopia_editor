// Copyright 2019 Stanford University see LICENSE for license

import PropTypes from "prop-types"
import React from "react"

const Alert = (props) => {
  if (!props.text) {
    return null
  }

  return (
    <div className="row">
      <div className="col" style={{ marginTop: "10px" }}>
        <div className="alert alert-danger alert-dismissible" role="alert">
          {props.text}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  )
}

Alert.propTypes = {
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
}

export default Alert
