// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import { connect } from 'react-redux'
import ResourceTemplateForm from './ResourceTemplateForm'
import { setResourceTemplate } from '../../actions/index'
import { getResourceTemplate } from '../../sinopiaServer'
import PropTypes from 'prop-types'
import Config from '../../Config'
const _ = require('lodash')

class ResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rtData: {}
    }
  }

  componentDidMount() {
    this.getResourceTemplatePromise(this.resourceTemplatePromise())
  }

  getResourceTemplatePromise = (promise) => {
    promise.then(response_and_body => {
      this.setState({rtData: response_and_body.response.body})
      this.props.handleResourceTemplate(this.state.rtData)
    }).catch(error => {
      this.setState({error: error})
    })
  }

  resourceTemplatePromise = () => {
    return getResourceTemplate(Config.defaultSinopiaGroupId, this.props.resourceTemplateId)
  }

  renderRtData = () => {
    return (
      <div className='ResourceTemplate'>
        <div id="resourceTemplate">
          <ResourceTemplateForm
            propertyTemplates = {this.state.rtData.propertyTemplates}
            resourceTemplate = {this.state.rtData}
            parentResourceTemplate = {this.props.resourceTemplateId}
            rtId = {this.state.rtData.id}
          />
        </div>
      </div>
    )
  }

  render () {
    let errorMessage = <span/>
    if (this.state.error) {
      errorMessage = <div className="alert alert-warning">Sinopia server is offline or has no resource templates to display</div>
    }
    return(
      _.isEmpty(this.state.rtData) ? ( errorMessage ) : this.renderRtData()
    )
  }
}

ResourceTemplate.propTypes = {
  handleResourceTemplate: PropTypes.func,
  resourceTemplateId: PropTypes.string,
  resourceTemplateData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  generateLD: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  handleResourceTemplate(resource_template) {
    dispatch(setResourceTemplate(resource_template))
  }
})

export default connect(null, mapDispatchToProps)(ResourceTemplate);
