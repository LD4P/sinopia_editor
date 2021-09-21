// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { selectValidationErrors } from "selectors/errors"
import { selectCurrentResourceKey } from "selectors/resources"
import Alert from "../Alert"

const ErrorMessages = (props) => {
  if (props.errors.length === 0) {
    return null
  }

  const errorList = props.errors.map((error) => (
    <li key={error.propertyKey + error.message}>
      {error.labelPath.join(" > ")}: {error.message}
    </li>
  ))
  const text = (
    <span>
      Unable to save this resource. Validation errors: <ul>{errorList}</ul>
    </span>
  )
  return <Alert text={text} />
}

ErrorMessages.propTypes = {
  errors: PropTypes.array,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state) => {
  const resourceKey = selectCurrentResourceKey(state)
  return {
    errors: selectValidationErrors(state, resourceKey),
  }
}

export default connect(mapStateToProps, {})(ErrorMessages)
