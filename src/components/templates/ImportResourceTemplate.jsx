
// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../Header'
import ImportFileZone from './ImportFileZone'
import SinopiaResourceTemplates from './SinopiaResourceTemplates'
import UpdateResourceModal from './UpdateResourceModal'
import { createResourceTemplate, updateResourceTemplate } from 'sinopiaServer'
import { getCurrentUser } from 'authSelectors'
import { fetchResourceTemplateSummaries as fetchResourceTemplateSummariesCreator } from 'actionCreators/resourceTemplates'

class ImportResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flashMessages: [],
      modalMessages: [],
      modalShow: false,
    }
  }

  modalClose = () => {
    this.setState({ modalShow: false })
  }

  // Resource templates are set via ImportFileZone and passed to ResourceTemplate via redirect to Editor
  setResourceTemplates = async (content, group) => {
    this.resetMessages()
    const responses = []
    // Prefer for ... of to forEach when loop body uses async/await

    for (const rt of content.Profile.resourceTemplates) {
      const response = await this.createResource(rt, group)

      responses.push(response)
    }
    this.updateStateFromServerResponses(responses)
    this.props.fetchResourceTemplateSummaries()
  }

  createResource = async (content, group) => {
    try {
      const response = await createResourceTemplate(content, group, this.props.currentUser)


      return response.response
    } catch (error) {
      this.setState({
        modalMessages: [...this.state.modalMessages, error.response],
      })

      return error.response
    }
  }

  updateResource = async (content, group) => {
    try {
      const response = await updateResourceTemplate(content, group, this.props.currentUser)


      return response.response
    } catch (error) {
      return error.response
    }
  }

  resetMessages = () => {
    this.setState({
      flashMessages: [],
      modalMessages: [],
    })
  }

  updateStateFromServerResponses = (responses) => {
    const newFlashMessages = []
    const newState = {}
    let showModal = false

    responses.forEach((response) => {
      // If any responses are HTTP 409s, flip `showModal` to true
      showModal = showModal || response.status === 409
      newFlashMessages.push(`${this.humanReadableStatus(response.status)} ${this.humanReadableLocation(response)}`)
    })

    if (newFlashMessages.length > 0) newState.flashMessages = [...this.state.flashMessages, ...newFlashMessages]

    if (showModal) newState.modalShow = true

    this.setState(newState)
  }

  // Returns a URL or an empty string
  humanReadableLocation = (response) => {
    if (response?.headers?.location) return response.headers.location

    if (response?.req?._data?.id) {
      // If RT has special characters—e.g., colons—in it, decode the URI to compare against ID
      const decodedURI = decodeURIComponent(response.req.url)
      // If the request URL already contains the ID, don't bother appending

      if (decodedURI.endsWith(response.req._data.id)) return decodedURI

      return `${decodedURI}/${response.req._data.id}`
    }

    // Welp, we tried anyway
    return ''
  }

  humanReadableStatus = (status) => {
    switch (status) {
      case 201:
        return 'Created'
      case 204:
        return 'Updated'
      case 401:
        return 'You are not authorized to do this. Try logging in again!'
      case 409:
        return 'Prompting user about updating'
      default:
        return `Unexpected response (${status})!`
    }
  }

  handleUpdateResource = async (rts, group) => {
    const responses = []
    // Prefer for ... of to forEach when loop body uses async/await

    for (const rt of rts) {
      const response = await this.updateResource(rt, group)

      responses.push(response)
    }
    this.updateStateFromServerResponses(responses)
    this.props.fetchResourceTemplateSummaries()

    this.modalClose()
  }

  render() {
    return (
      <div id="importResourceTemplate">
        <div>
          { this.state.modalShow ? (
            <UpdateResourceModal show={this.state.modalShow}
                                 close={this.modalClose}
                                 messages={this.state.modalMessages}
                                 update={this.handleUpdateResource} />)
            : (<div/>) }
        </div>
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <ImportFileZone setResourceTemplateCallback={this.setResourceTemplates} />
        <SinopiaResourceTemplates messages={this.state.flashMessages} history={this.props.history} key="sinopia-resource-templates" />
      </div>
    )
  }
}

ImportResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  currentUser: PropTypes.object,
  fetchResourceTemplateSummaries: PropTypes.func,
  history: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => ({
  fetchResourceTemplateSummaries: () => {
    dispatch(fetchResourceTemplateSummariesCreator())
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(ImportResourceTemplate)
