// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import { getResourceTemplate } from 'selectors/resourceSelectors'
import CopyToNewMessage from './CopyToNewMessage'
import ResourceURIMessage from './ResourceURIMessage'
import SaveAlert from './SaveAlert'
import RDFDisplay from './RDFDisplay'
import _ from 'lodash'

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  render() {
    if (this.props.error) {
      return (<div className="alert alert-warning">{ this.props.error }</div>)
    }

    if (_.isEmpty(this.props.resourceTemplate)) {
      return null
    }
    return (
      <div className="ResourceTemplate">
        <div id="resourceTemplate">
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
  error: PropTypes.string,
  unusedRDF: PropTypes.string,
}

const mapStateToProps = (state) => {
  const resourceTemplateId = _.first(Object.keys(state.selectorReducer.resource))

  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const error = state.selectorReducer.editor.retrieveResourceTemplateError
  const unusedRDF = state.selectorReducer.editor.unusedRDF
  return {
    resourceTemplate,
    error,
    unusedRDF,
  }
}

export default connect(mapStateToProps)(ResourceTemplate)
