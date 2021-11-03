// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import LoadByRDFForm from "./LoadByRDFForm"
import Alert from "../Alert"
import AlertsProvider from "../AlertsProvider"

// Errors from retrieving a resource from this page.
export const loadResourceByRDFErrorKey = "loadrdfresource"

const LoadResource = (props) => (
  <AlertsProvider value={loadResourceByRDFErrorKey}>
    <div id="loadResource">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <Alert />
      <LoadByRDFForm {...props} />
    </div>
  </AlertsProvider>
)

LoadResource.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

export default LoadResource
