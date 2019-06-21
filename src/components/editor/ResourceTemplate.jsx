// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import { rootResourceTemplateLoaded } from 'actions/index'
import { getResourceTemplate } from 'sinopiaServer'

const _ = require('lodash')

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rtData: {},
    }
  }

  // Called immediately after the component is rendered for the first time
  componentDidMount() {
    if (this.props.resourceTemplateId) {
      this.resolveResourceTemplatePromise(getResourceTemplate(this.props.resourceTemplateId))
    }
  }

  resolveResourceTemplatePromise = (promise) => {
    promise.then((responseAndBody) => {
      this.setState({ rtData: responseAndBody.response.body })
      this.props.handleResourceTemplate(this.state.rtData)
    }).catch((error) => {
      this.setState({ error })
    })
  }

  renderRtData = () => (
    <div className="ResourceTemplate">
      <div id="resourceTemplate" style={{ marginTop: '-30px' }}>
        <section className="col-md-9">
          <h1><em>{this.state.rtData.resourceLabel}</em></h1>
        </section>
        <ResourceTemplateForm
            propertyTemplates = {this.state.rtData.propertyTemplates}
            resourceTemplate = {this.state.rtData}
            parentResourceTemplate = {this.props.resourceTemplateId}
            rtId = {this.state.rtData.id}
        />
      </div>
    </div>
  )

  render() {
    let errorMessage = <span/>

    if (this.state.error) {
      errorMessage = <div className="alert alert-warning">Sinopia server is offline or has no resource templates to display</div>
    }

    return (
      _.isEmpty(this.state.rtData) ? errorMessage : this.renderRtData()
    )
  }
}

ResourceTemplate.propTypes = {
  handleResourceTemplate: PropTypes.func,
  resourceTemplateId: PropTypes.string,
  resourceTemplateData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

const mapDispatchToProps = dispatch => ({
  handleResourceTemplate(resourceTemplate) {
    dispatch(rootResourceTemplateLoaded(resourceTemplate))
  },
})

export default connect(null, mapDispatchToProps)(ResourceTemplate)
