// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import { fetchRootResourceTemplate, newResource as newResourceCreator } from 'actionCreators'
import { rootResource, getResourceTemplate } from 'selectors/resourceSelectors'
import ResourceURIMessage from './ResourceURIMessage'
const _ = require('lodash')

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  // Called immediately after the component is rendered for the first time
  componentDidMount() {
    // this.props.retrieveResourceTemplate(this.props.resourceTemplateId)
    // This should be invoked by user clicking resource template name.
    // this.props.newResource(this.props.resourceTemplateId)
  }

  render() {
    if (this.props.error) {
      return (<div className="alert alert-warning">{ this.props.error }</div>)
    }

    if (_.isEmpty(this.props.resourceTemplate)) {
      return null
    }
    return (
      <div className="ResourceTemplate">
        <div id="resourceTemplate" style={{ marginTop: '-30px' }}>
          <section className="col-md-9">
            <h1><em>{this.props.resourceTemplate.resourceLabel}</em></h1>
            <ResourceURIMessage />
          </section>
          <ResourceTemplateForm reduxPath = {['resource', this.props.resourceTemplate.id]} />
        </div>
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  retrieveResourceTemplate: PropTypes.func,
  resourceTemplate: PropTypes.object,
  error: PropTypes.string,
  newResource: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const resourceTemplateId = _.first(Object.keys(state.selectorReducer.resource))

  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const error = state.selectorReducer.editor.serverError
  return {
    resourceTemplate,
    error,
  }
}

const mapDispatchToProps = dispatch => ({
  retrieveResourceTemplate: (resourceTemplate) => {
    dispatch(fetchRootResourceTemplate(resourceTemplate))
  },
  newResource: (resourceTemplateId) => {
    dispatch(newResourceCreator(resourceTemplateId))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplate)
