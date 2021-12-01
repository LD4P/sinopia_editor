// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"
import { metricsErrorKey } from "utilities/errorKeyFactory"
import Header from "../Header"
import { clearErrors } from "actions/errors"

const MetricsWrapper = ({ title, children, triggerHandleOffsetMenu }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(clearErrors(metricsErrorKey))
  }, [dispatch])

  return (
    <AlertsContextProvider value={metricsErrorKey}>
      <div id="metrics">
        <Header triggerEditorMenu={triggerHandleOffsetMenu} />
        <ContextAlert />
        <h3>{title}</h3>
        {children}
      </div>
    </AlertsContextProvider>
  )
}
MetricsWrapper.displayName = "MetricsWrapper"

MetricsWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  triggerHandleOffsetMenu: PropTypes.func,
  title: PropTypes.string.isRequired,
}

export default MetricsWrapper
