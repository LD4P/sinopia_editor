// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import { getResourceTemplate, findErrors } from 'selectors/resourceSelectors'
import CopyToNewMessage from './CopyToNewMessage'
import ResourceURIMessage from './ResourceURIMessage'
import SaveAlert from './SaveAlert'
import RDFDisplay from './RDFDisplay'
import Alerts from '../Alerts'
import _ from 'lodash'

// Error key for errors that occur while editing a resource.
export const resourceEditErrorKey = 'resourceedit'

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  render() {
    if (!_.isEmpty(this.props.errors)) {
      return (<Alerts errorKey={resourceEditErrorKey} />)
    }

    if (_.isEmpty(this.props.resourceTemplate)) {
      return null
    }
    return (
      <div className="ResourceTemplate">
        <div id="resourceTemplate" style={{ marginTop: '-30px' }}>
          <section>
            <h1><em>{this.props.resourceTemplate.resourceLabel}</em></h1>
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
          <ResourceTemplateForm reduxPath = {['resource', this.props.resourceTemplate.id]} />
        </div>
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  resourceTemplate: PropTypes.object,
  errors: PropTypes.array,
  unusedRDF: PropTypes.string,
}

const mapStateToProps = (state) => {
  const resourceTemplateId = _.first(Object.keys(state.selectorReducer.resource))

  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const errors = findErrors(state, resourceEditErrorKey)
  const unusedRDF = state.selectorReducer.editor.unusedRDF
  return {
    resourceTemplate,
    errors,
    unusedRDF,
  }
}

export default connect(mapStateToProps)(ResourceTemplate)
