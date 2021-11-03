// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import {selectErrors} from "selectors/errors"
import useAlerts from "hooks/useAlerts"

const Alert = () => {
  const errorKey = useAlerts()

  console.log('alert', errorKey)

  const errors = useSelector((state) => selectErrors(state, errorKey))
  if (_.isEmpty(errors)) return null

  const errorText = errors.map((error) => <p key={error}>{error}</p>)

  return (
    <div className="row">
      <div className="col" style={{ marginTop: "10px" }}>
        <div className="alert alert-danger" role="alert">
          {errorText}
        </div>
      </div>
    </div>
  )
}

export default Alert
