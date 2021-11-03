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
import Alerts from "components/alerts/OldAlerts"
import { newResourceErrorKey } from "./property/ResourceList"
import { resourceEditErrorKey, resourceEditWarningKey } from "./Editor"
import {
  selectCurrentResourceKey,
  selectNormSubject,
} from "selectors/resources"
import { selectErrors } from "selectors/errors"
import _ from "lodash"
import UnusedRDFDisplay from "./UnusedRDFDisplay"

/**
 * This is the root component of the editor on the resource edit page
 */
const ResourceComponent = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const errors = useSelector((state) =>
    selectErrors(state, resourceEditErrorKey(resourceKey))
  )

  if (!_.isEmpty(errors)) {
    return <Alerts errorKey={resourceEditErrorKey(resourceKey)} />
  }
  if (!resource) {
    return null
  }

  return (
    <div id="resourceTemplate">
      <Alerts errorKey={resourceEditWarningKey(resourceKey)} />
      <Alerts errorKey={newResourceErrorKey} />
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
