// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PanelResource from './property/PanelResource'
import { selectErrors } from 'selectors/errors'
import CopyToNewMessage from './CopyToNewMessage'
import ResourceURIMessage from './ResourceURIMessage'
import SaveAlert from './SaveAlert'
import RDFDisplay from './RDFDisplay'
import Alerts from '../Alerts'
import { newResourceErrorKey } from './property/ResourceList'
import { resourceEditErrorKey } from './Editor'
import { selectCurrentResourceKey, selectCurrentResource } from 'selectors/resources'
import _ from 'lodash'

/**
 * This is the root component of the editor on the resource edit page
 */
const ResourceComponent = (props) => {
  if (!_.isEmpty(props.errors)) {
    return (<Alerts errorKey={resourceEditErrorKey(props.resourceKey)} />)
  }
  if (!props.resource) {
    return null
  }

  return (
    <div className="ResourceTemplate">
      <div id="resourceTemplate">
        <Alerts errorKey={resourceEditErrorKey(props.resourceKey)} />
        <Alerts errorKey={newResourceErrorKey} />
        <section>
          <h3>{props.resource.subjectTemplate.label}</h3>
          <CopyToNewMessage />
          <ResourceURIMessage />
          <SaveAlert />
        </section>
        {props.unusedRDF
         && <div className="alert alert-warning" role="alert">
           <strong>Unable to load the entire resource.</strong> The unused triples are:
           <RDFDisplay rdf={props.unusedRDF} />
         </div>
        }
        <PanelResource resource={props.resource} />
      </div>
    </div>
  )
}

ResourceComponent.propTypes = {
  errors: PropTypes.array,
  unusedRDF: PropTypes.string,
  resourceKey: PropTypes.string,
  resource: PropTypes.object,
}

const mapStateToProps = (state) => {
  const resourceKey = selectCurrentResourceKey(state)
  return {
    resourceKey,
    resource: selectCurrentResource(state),
    errors: selectErrors(state, resourceEditErrorKey(resourceKey)),
    unusedRDF: state.selectorReducer.editor.unusedRDF[resourceKey],
  }
}

export default connect(mapStateToProps)(ResourceComponent)
