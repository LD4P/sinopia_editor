// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import LoadByRDFForm from "./LoadByRDFForm"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"

// Errors from loading a resource by RDF.
const loadResourceByRDFErrorKey = "loadrdfresource"

const LoadResource = (props) => (
  <AlertsContextProvider value={loadResourceByRDFErrorKey}>
    <div id="loadResource">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <ContextAlert />
      <LoadByRDFForm {...props} />
    </div>
  </AlertsContextProvider>
)

LoadResource.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

export default LoadResource
