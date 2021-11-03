// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import TemplateSearch from "./TemplateSearch"
import Alert from "../Alert"
import AlertsProvider from "../AlertsProvider"

export const templateErrorKey = "template"

const ResourceTemplate = (props) => (
  <AlertsProvider value={templateErrorKey}>
    <section id="resourceTemplate">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <Alert />
      <TemplateSearch history={props.history} />
    </section>
  </AlertsProvider>
)

ResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

export default ResourceTemplate
