// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PanelResource from './property/PanelResource'
import CopyToNewMessage from './CopyToNewMessage'
import ResourceURIMessage from './ResourceURIMessage'
import SaveAlert from './SaveAlert'
import RDFDisplay from './RDFDisplay'
import Alerts from '../Alerts'
import { newResourceErrorKey } from './property/ResourceList'
import { resourceEditErrorKey } from './Editor'
import { addError } from 'actions/errors'
import { datasetFromN3 } from 'utilities/Utilities'
import { selectCurrentResource } from 'selectors/resources'
import { selectErrors } from 'selectors/errors'
import { selectUnusedRDF } from 'selectors/modals'
import _ from 'lodash'

/**
 * This is the root component of the editor on the resource edit page
 */
const ResourceComponent = () => {
  const dispatch = useDispatch()
  const resource = useSelector((state) => selectCurrentResource(state))
  const resourceKey = resource.key
  const errors = useSelector((state) => selectErrors(state, resourceEditErrorKey(resourceKey)))
  const unusedRDF = useSelector((state) => selectUnusedRDF(state, resourceKey))

  const [dataset, setDataset] = useState(null)

  useEffect(() => {
    if (_.isEmpty(unusedRDF)) return
    datasetFromN3(unusedRDF)
      .then((dataset) => setDataset(dataset))
      .catch((err) => dispatch(addError(resourceEditErrorKey(resourceKey), err.message || err)))
  }, [unusedRDF, resourceKey, dispatch])

  if (!_.isEmpty(errors)) {
    return (<Alerts errorKey={resourceEditErrorKey(resourceKey)} />)
  }
  if (!resource) {
    return null
  }

  return (
    <div className="ResourceTemplate">
      <div id="resourceTemplate">
        <Alerts errorKey={resourceEditErrorKey(resourceKey)} />
        <Alerts errorKey={newResourceErrorKey} />
        <section>
          <h3>{resource.subjectTemplate.label}</h3>
          <CopyToNewMessage />
          <ResourceURIMessage />
          <SaveAlert />
        </section>
        {dataset
         && <div className="alert alert-warning" role="alert">
           <strong>Unable to load the entire resource.</strong> The unused triples are:
           <RDFDisplay dataset={dataset} />
         </div>
        }
        <PanelResource resource={resource} />
      </div>
    </div>
  )
}

export default ResourceComponent
