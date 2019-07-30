// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import { newResource } from 'actionCreators/resources'
import { getResourceTemplate } from 'selectors/resourceSelectors'
import { bindActionCreators } from 'redux'
import loadLanguages from 'actionCreators/languages'
import ResourceURIMessage from './ResourceURIMessage'
import SaveAlert from './SaveAlert'
import _ from 'lodash'

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  componentDidMount() {
    // We load the languages once here so that each literal doesn't try to hit the LOC endpoint
    this.props.loadLanguages()
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
          <section>
            <h1><em>{this.props.resourceTemplate.resourceLabel}</em></h1>
            <ResourceURIMessage />
            <SaveAlert />
          </section>
          <ResourceTemplateForm reduxPath = {['resource', this.props.resourceTemplate.id]} />
        </div>
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  resourceTemplate: PropTypes.object,
  error: PropTypes.string,
  newResource: PropTypes.func,
  loadLanguages: PropTypes.func,
}

const mapStateToProps = (state) => {
  const resourceTemplateId = _.first(Object.keys(state.selectorReducer.resource))

  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const error = state.selectorReducer.editor.serverError
  return {
    resourceTemplate,
    error,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ loadLanguages, newResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplate)
