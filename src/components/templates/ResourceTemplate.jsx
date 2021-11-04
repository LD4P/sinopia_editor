// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import TemplateSearch from "./TemplateSearch"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"

const ResourceTemplate = (props) => (
  <AlertsContextProvider value={"temporary!"}>
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
