// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import { selectValidationErrors } from "selectors/errors"
import Alert from "components/alerts/OldAlert"
import _ from "lodash"

const ErrorMessages = ({ resourceKey }) => {
  // To determine if errors have changed, check length first and then isEqual.
  // Most changes in errors will change the length, but not all.
  const errors = useSelector(
    (state) => selectValidationErrors(state, resourceKey),
    (obj1, obj2) => obj1?.length === obj2?.length && _.isEqual(obj1, obj2)
  )
  if (_.isEmpty(errors)) return null

  const errorList = errors.map((error) => (
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
  resourceKey: PropTypes.string.isRequired,
}

export default ErrorMessages
