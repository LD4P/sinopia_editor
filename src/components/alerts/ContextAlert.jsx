// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectErrors } from "selectors/errors"
import useAlerts from "hooks/useAlerts"
import Alert from "./Alert"
import { hideModal } from "actions/modals"
import _ from "lodash"

const ContextAlert = () => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const errors = useSelector((state) => selectErrors(state, errorKey))

  useEffect(() => {
    if (!_.isEmpty(errors)) dispatch(hideModal())
  }, [errors, dispatch])

  if (_.isEmpty(errors)) return null

  return <Alert errors={errors} />
}

export default ContextAlert
