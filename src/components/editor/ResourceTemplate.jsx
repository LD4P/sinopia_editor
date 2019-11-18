// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import {
  getResourceTemplate, findErrors, rootResourceTemplateId, currentResourceKey,
} from 'selectors/resourceSelectors'
import CopyToNewMessage from './CopyToNewMessage'
import ResourceURIMessage from './ResourceURIMessage'
import SaveAlert from './SaveAlert'
import RDFDisplay from './RDFDisplay'
import Alerts from '../Alerts'
import { newResourceErrorKey } from './property/ResourceList'
import { resourceEditErrorKey } from './Editor'
import _ from 'lodash'

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  render() {
    if (!_.isEmpty(this.props.errors) && _.isEmpty(this.props.resourceTemplate)) {
      return (<Alerts errorKey={resourceEditErrorKey(this.props.resourceKey)} />)
    }

    if (_.isEmpty(this.props.resourceTemplate)) {
      return null
    }
    return (
      <div className="ResourceTemplate">
        <div id="resourceTemplate">
          <Alerts errorKey={resourceEditErrorKey(this.props.resourceKey)} />
          <Alerts errorKey={newResourceErrorKey} />
          <section>
            <h3>{this.props.resourceTemplate.resourceLabel}</h3>
            <CopyToNewMessage />
            <ResourceURIMessage />
            <SaveAlert />
          </section>
          {this.props.unusedRDF
            && <div className="alert alert-warning" role="alert">
              <strong>Unable to load the entire resource.</strong> The unused triples are:
              <RDFDisplay rdf={this.props.unusedRDF} />
            </div>
          }
          <ResourceTemplateForm reduxPath = {['entities', 'resources', this.props.resourceKey, this.props.resourceTemplate.id]} />
        </div>
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  resourceTemplate: PropTypes.object,
  errors: PropTypes.array,
  unusedRDF: PropTypes.string,
  resourceKey: PropTypes.string,
}

const mapStateToProps = (state) => {
  const resourceTemplateId = rootResourceTemplateId(state)
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const resourceKey = currentResourceKey(state)
  const errors = findErrors(state, resourceEditErrorKey(resourceKey))
  const unusedRDF = state.selectorReducer.editor.unusedRDF[resourceKey]

  return {
    resourceKey,
    resourceTemplate,
    errors,
    unusedRDF,
  }
}

export default connect(mapStateToProps)(ResourceTemplate)
