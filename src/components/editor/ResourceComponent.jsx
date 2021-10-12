// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import PanelResource from "./property/PanelResource"
import CopyToNewMessage from "./CopyToNewMessage"
import ResourceURIMessage from "./ResourceURIMessage"
import PermissionsAction from "./actions/PermissionsAction"
import SaveAlert from "./SaveAlert"
import RDFDisplay from "./RDFDisplay"
import Alerts from "../Alerts"
import { newResourceErrorKey } from "./property/ResourceList"
import { resourceEditErrorKey, resourceEditWarningKey } from "./Editor"
import { addError } from "actions/errors"
import { datasetFromN3 } from "utilities/Utilities"
import {
  selectCurrentResourceKey,
  selectCurrentResourceIsReadOnly,
  selectNormSubject,
} from "selectors/resources"
import { selectErrors } from "selectors/errors"
import { selectUnusedRDF } from "selectors/modals"
import _ from "lodash"

/**
 * This is the root component of the editor on the resource edit page
 */
const ResourceComponent = () => {
  const dispatch = useDispatch()
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const errors = useSelector((state) =>
    selectErrors(state, resourceEditErrorKey(resourceKey))
  )
  const unusedRDF = useSelector((state) => selectUnusedRDF(state, resourceKey))
  const readOnly = useSelector((state) =>
    selectCurrentResourceIsReadOnly(state)
  )

  const [dataset, setDataset] = useState(null)

  useEffect(() => {
    if (_.isEmpty(unusedRDF)) return
    datasetFromN3(unusedRDF)
      .then((dataset) => setDataset(dataset))
      .catch((err) =>
        dispatch(
          addError(resourceEditErrorKey(resourceKey), err.message || err)
        )
      )
  }, [unusedRDF, resourceKey, dispatch])

  if (!_.isEmpty(errors)) {
    return <Alerts errorKey={resourceEditErrorKey(resourceKey)} />
  }
  if (!resource) {
    return null
  }

  return (
    <div className="ResourceTemplate">
      <div id="resourceTemplate">
        <Alerts errorKey={resourceEditErrorKey(resourceKey)} />
        <Alerts errorKey={resourceEditWarningKey(resourceKey)} />
        <Alerts errorKey={newResourceErrorKey} />
        <section>
          <h3>{resource.label}</h3>
          <CopyToNewMessage />
          <div className="row">
            <div className="col-md-11">
              <ResourceURIMessage />
            </div>
            <div className="col-md-1">
              <PermissionsAction />
            </div>
          </div>
          <SaveAlert />
        </section>
        {dataset && !readOnly && (
          <div className="alert alert-warning" role="alert">
            <strong>Unable to load the entire resource.</strong> The unused
            triples are:
            <RDFDisplay dataset={dataset} />
          </div>
        )}
        <PanelResource resource={resource} />
      </div>
    </div>
  )
}

export default ResourceComponent
