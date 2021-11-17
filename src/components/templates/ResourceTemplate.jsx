// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import TemplateSearch from "./TemplateSearch"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"
import { templateErrorKey } from "utilities/errorKeyFactory"

const ResourceTemplate = (props) => (
  <AlertsContextProvider value={templateErrorKey}>
    <section id="resourceTemplate">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <ContextAlert />
      <TemplateSearch history={props.history} />
    </section>
  </AlertsContextProvider>
)

ResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

export default ResourceTemplate
