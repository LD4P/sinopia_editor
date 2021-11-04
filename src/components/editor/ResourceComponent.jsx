// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PanelResource from "./property/PanelResource"
import CopyToNewMessage from "./CopyToNewMessage"
import ResourceURIMessage from "./ResourceURIMessage"
import CopyToNewButton from "./actions/CopyToNewButton"
import PreviewButton from "./actions/PreviewButton"
import PermissionsAction from "./actions/PermissionsAction"
import SaveAlert from "./SaveAlert"
import {
  selectCurrentResourceKey,
  selectNormSubject,
} from "selectors/resources"
import UnusedRDFDisplay from "./UnusedRDFDisplay"

/**
 * This is the root component of the editor on the resource edit page
 */
const ResourceComponent = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))

  if (!resource) {
    return null
  }

  return (
    <div id="resourceTemplate">
      <section className="resource-header">
        <h3>
          {resource.label}
          <CopyToNewButton />
          <PreviewButton />
        </h3>
        <CopyToNewMessage />
        <div className="row">
          <div className="col-md-11">
            <ResourceURIMessage resourceKey={resourceKey} />
          </div>
          <div className="col-md-1">
            <PermissionsAction />
          </div>
        </div>
        <SaveAlert />
      </section>
      <UnusedRDFDisplay />
      <PanelResource resource={resource} />
    </div>
  )
}

export default ResourceComponent
