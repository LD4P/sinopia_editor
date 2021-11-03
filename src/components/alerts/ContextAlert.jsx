// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import { selectErrors } from "selectors/errors"
import useAlerts from "hooks/useAlerts"
import Alert from "./Alert"
import _ from "lodash"

const ContextAlert = () => {
  const errorKey = useAlerts()
  const errors = useSelector((state) => selectErrors(state, errorKey))

  if (_.isEmpty(errors)) return null

  return <Alert errors={errors} />
}

export default ContextAlert
