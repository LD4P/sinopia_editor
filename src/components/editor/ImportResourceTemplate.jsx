// Copyright 2018 Stanford University see Apache2.txt for license

import SinopiaServer from 'sinopia_server'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import ImportFileZone from './ImportFileZone'
import SinopiaResourceTemplates from './SinopiaResourceTemplates'
import UpdateResourceModal from './UpdateResourceModal'
import { loadState } from '../../localStorage'
import Config from '../../../src/Config'

class ImportResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: [],
      createResourceError: [],
      updateKey: 0,
      modalShow: false
    }
    // Moving this into the constructor makes it easier to stub in tests
    this.instance = new SinopiaServer.LDPApi()
    const curJwt = loadState('jwtAuth')

    this.instance.apiClient.basePath = Config.sinopiaServerBase
    if (curJwt !== undefined) {
      this.instance.apiClient.authentications['CognitoUser'].accessToken = curJwt.id_token
    }
  }

  componentDidMount() {
    const incrementedKey = this.state.updateKey + 1
    // This causes the `SinopiaResourceTemplates` component to do the initial load of RTs
    this.setState({ updateKey: incrementedKey })
  }

  modalClose = newKey => {
    const newState = {
      modalShow: false
    }
    // Inject the incremented key if given an integer
    if (newKey && Number.isInteger(newKey)) {
      newState.updateKey = newKey
    }

    this.setState( newState )
  }

  // Resource templates are set via ImportFileZone and passed to ResourceTemplate via redirect to Editor
  setResourceTemplates = (content, group) => {
    const profileCount = content.Profile.resourceTemplates.length
    content.Profile.resourceTemplates.forEach(async rt => {
      const response = await this.createResource(rt, group)
      this.updateStateFromServerResponse(response, profileCount)
    })
    const incrementedKey = this.state.updateKey + 1
    this.setState({ updateKey: incrementedKey })
  }

  createResource = async (content, group) => {
    try {
      const response = await this.instance.createResourceWithHttpInfo(group, content, { slug: content.id, contentType: 'application/json' })
      return response.response
    } catch(error) {
      this.setState({
        createResourceError: [...this.state.createResourceError, error.response]
      })
      return error.response
    }
  }

  updateResource = async (content, group) => {
    try {
      const response = await this.instance.updateResourceWithHttpInfo(group, content.id, content, { contentType: 'application/json' })
      return response.response
    } catch(error) {
      return error.response
    }
  }

  updateStateFromServerResponse = (response, profileCount) => {
    // HTTP status 409 == Conflict
    const showModal = response.status === 409 && this.state.createResourceError.length >= profileCount

    const location = response.headers.location || ''
    const newMessage = `${this.humanReadableStatus(response.status)} ${location}`
    const newState = {
      message: [...this.state.message, newMessage]
    }

    if (showModal)
      newState.modalShow = true

    this.setState(newState)
  }

  humanReadableStatus = status => {
    switch(status) {
      case 201:
        return 'Created'
      case 204:
        return 'Updated'
      case 401:
        return 'You are not authorized to do this. Try logging in again!'
      case 409:
        return 'Attempting to update'
      default:
        return `Unexpected response (${status})!`
    }
  }

  handleUpdateResource = (rts, group) => {
    rts.forEach(async rt => {
      const response = await this.updateResource(rt, group)
      this.updateStateFromServerResponse(response)
    })
    const incrementedKey = this.state.updateKey + 1
    this.modalClose(incrementedKey)
  }

  render() {
    return(
      <div id="importResourceTemplate">
        <div>
        { (this.state.modalShow) ? (
          <UpdateResourceModal show={this.state.modalShow}
                               close={this.modalClose}
                               message={this.state.createResourceError}
                               update={this.handleUpdateResource} /> ) :
          ( <div/> ) }
        </div>
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <ImportFileZone setResourceTemplateCallback={this.setResourceTemplates} />
        <SinopiaResourceTemplates updateKey={this.state.updateKey}
                                  message={this.state.message} />
      </div>
    )
  }
}

ImportResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func
}

export default ImportResourceTemplate
