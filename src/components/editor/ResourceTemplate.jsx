// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateForm from './ResourceTemplateForm'
import { rootResourceTemplateLoaded } from 'actions/index'
import { getResourceTemplate } from 'sinopiaServer'
import { rootResource } from 'selectors/resourceSelectors'

const _ = require('lodash')

/**
 * This is the root component of the editor on the resource edit page
 */
class ResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // Called immediately after the component is rendered for the first time
  componentDidMount() {
    if (!this.props.resourceTemplate) {
      this.resolveResourceTemplatePromise(getResourceTemplate(this.props.resourceTemplateId))
    }
  }

  resolveResourceTemplatePromise = (promise) => {
    promise.then((responseAndBody) => {
      this.props.handleResourceTemplate(responseAndBody.response.body)
    }).catch((error) => {
      console.error(error)
      this.setState({ error })
    })
  }

  render() {
    if (_.isEmpty(this.props.resourceTemplate)) {
      let errorMessage = <span/>

      if (this.state.error) {
        errorMessage = <div className="alert alert-warning">Sinopia server is offline or has no resource templates to display</div>
      }
      return errorMessage
    }

    return (
      <div className="ResourceTemplate">
        <div id="resourceTemplate" style={{ marginTop: '-30px' }}>
          <section className="col-md-9">
            <h1><em>{this.props.title}</em></h1>
          </section>
          <ResourceTemplateForm rtId = {this.props.resourceTemplateId} />
        </div>
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  handleResourceTemplate: PropTypes.func,
  resourceTemplateId: PropTypes.string,
  resourceTemplate: PropTypes.object,
  title: PropTypes.string,
}

const mapStateToProps = (state, ourProps) => ({
  resourceTemplate: rootResource(state),
  title: state.selectorReducer.entities.resourceTemplates[ourProps.resourceTemplateId]?.resourceLabel,
})

const mapDispatchToProps = dispatch => ({
  handleResourceTemplate(resourceTemplate) {
    dispatch(rootResourceTemplateLoaded(resourceTemplate))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplate)
