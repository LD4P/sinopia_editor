// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef, useState, useLayoutEffect } from "react"
import PropTypes from "prop-types"
import AlertWrapper from "./AlertWrapper"
import _ from "lodash"

const Alert = ({ errors }) => {
  const ref = useRef()
  const [lastErrors, setLastErrors] = useState(false)

  useLayoutEffect(() => {
    // Only scroll if changed errors
    if (_.isEqual(lastErrors, errors)) return
    if (!_.isEmpty(errors)) window.scrollTo(0, ref.current.offsetTop)
    setLastErrors([...errors])
  }, [errors, lastErrors])

  if (_.isEmpty(errors)) return null

  const errorText = errors.map((error) => <p key={error}>{error}</p>)

  return <AlertWrapper ref={ref}>{errorText}</AlertWrapper>
}

Alert.propTypes = {
  errors: PropTypes.array.isRequired,
}

export default Alert
