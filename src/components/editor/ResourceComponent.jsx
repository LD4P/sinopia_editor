// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import PanelResource from "./property/PanelResource"
import CopyToNewMessage from "./CopyToNewMessage"
import ResourceURIMessage from "./ResourceURIMessage"
import PermissionsAction from "./actions/PermissionsAction"
import SaveAlert from "./SaveAlert"
import {
  selectCurrentResourceKey,
  selectNormSubject,
} from "selectors/resources"
import UnusedRDFDisplay from "./UnusedRDFDisplay"
import { isInViewport } from "utilities/Utilities"
import CloseButton from "./actions/CloseButton"
import SaveAndPublishButton from "./actions/SaveAndPublishButton"
import CopyToNewButton from "./actions/CopyToNewButton"
import PreviewButton from "./actions/PreviewButton"
import ResourceTitle from "./ResourceTitle"

/**
 * This is the root component of the editor on the resource edit page
 */
const ResourceComponent = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const [isHeaderInViewport, setHeaderInViewport] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      const currentlyInViewport = isInViewport(
        document.querySelector("#sticky-beacon")
      )
      if (isHeaderInViewport !== currentlyInViewport) {
        setHeaderInViewport(currentlyInViewport)
      }
    }
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [isHeaderInViewport])

  if (!resource) {
    return null
  }

  const stickyClasses = ["sticky-resource-header"]
  if (isHeaderInViewport) stickyClasses.push("d-none")

  return (
    <div id="resourceTemplate">
      <section className="resource-header">
        <h3 id="resource-header">
          <ResourceTitle resource={resource} />
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
      <div id="sticky-beacon" />
      <section className={stickyClasses.join(" ")} id="sticky-resource-header">
        <div className="row">
          <div className="col-md-10">
            <h3>
              <ResourceTitle resource={resource} />
              <CopyToNewButton />
              <PreviewButton />
            </h3>
          </div>
          <div className="col-md-2">
            <div className="d-flex justify-content-end">
              <CloseButton css={"editor-action-close"} label={"Close"} />
              <SaveAndPublishButton class="editor-save" />
            </div>
          </div>
        </div>
        <CopyToNewMessage />
        <div className="row">
          <div className="col">
            <ResourceURIMessage resourceKey={resourceKey} />
          </div>
        </div>
      </section>
      <UnusedRDFDisplay />
      <PanelResource resource={resource} />
    </div>
  )
}

export default ResourceComponent
