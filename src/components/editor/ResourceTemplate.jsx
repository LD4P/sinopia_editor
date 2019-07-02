// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import { fetchRootResourceTemplate } from 'actionCreators'
import { rootResource } from 'selectors/resourceSelectors'
import ResourceURIMessage from './ResourceURIMessage'

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  // Called immediately after the component is rendered for the first time
  componentDidMount() {
    this.props.retrieveResourceTemplate(this.props.resourceTemplateId)
  }

  render() {
    let errorMessage = <span/>

    if (this.props.error) {
      errorMessage = <div className="alert alert-warning">{ this.props.error }</div>
    }

    if (!this.props.resourceTemplate) {
      return errorMessage
    }

    return (
      <div className="ResourceTemplate">
        <div id="resourceTemplate" style={{ marginTop: '-30px' }}>
          <section className="col-md-9">
            <h1><em>{this.props.resourceTemplateLabel}</em></h1>
            <ResourceURIMessage />
          </section>
          <ResourceTemplateForm rtId = {this.props.resourceTemplateId} />
        </div>
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  retrieveResourceTemplate: PropTypes.func,
  resourceTemplateId: PropTypes.string,
  resourceTemplate: PropTypes.object,
  resourceTemplateLabel: PropTypes.string,
  error: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  const resourceTemplate = rootResource(state)
  const resourceTemplateLabel = state.selectorReducer.entities.resourceTemplates[ownProps.resourceTemplateId]?.resourceLabel
  const error = state.selectorReducer.editor.serverError
  return {
    resourceTemplate,
    resourceTemplateLabel,
    error,
  }
}

const mapDispatchToProps = dispatch => ({
  retrieveResourceTemplate: (resourceTemplate) => {
    dispatch(fetchRootResourceTemplate(resourceTemplate))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplate)
