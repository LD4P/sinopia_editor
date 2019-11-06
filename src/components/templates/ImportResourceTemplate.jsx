// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../Header'
import ImportFileZone from './ImportFileZone'
import SinopiaResourceTemplates from './SinopiaResourceTemplates'
import UpdateResourceModal from './UpdateResourceModal'
import CreateResourceMessages from './CreateResourceMessages'
import { createResourceTemplate, updateResourceTemplate } from 'sinopiaServer'
import { getCurrentUser } from 'authSelectors'
import { showModal } from 'actions/index'
import TemplateSearch from './TemplateSearch'


class ImportResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flashMessages: [],
      modalMessages: [],
    }
  }

  // Resource templates are set via ImportFileZone and passed to ResourceTemplate via redirect to Editor
  setResourceTemplates = async (content, group) => {
    this.resetMessages()
    const responses = []
    // Prefer for ... of to forEach when loop body uses async/await

    // if we have a profile with multiple resource templates, iterate and load all of them
    if (content.Profile) {
      for (const rt of content.Profile.resourceTemplates) {
        const response = await this.createResource(rt, group)
        responses.push(response)
      }
    }
    else // if the uploaded content is a single resource template, just load that one
    {
      const response = await this.createResource(content, group)
      responses.push(response)
    }
    this.updateStateFromServerResponses(responses)
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
    let showModal = false

    responses.forEach((response) => {
      // If any responses are HTTP 409s, flip `showModal` to true, which then renders the overwrite confirmation prompt
      showModal = showModal || response.status === 409
      if (!showModal) { // only show flash error messages if we are *not* showing the modal confirmation
        newFlashMessages.push(`${this.humanReadableStatus(response.status)} ${this.humanReadableLocation(response)}`)
      }
    })

    if (newFlashMessages.length > 0) {
      this.setState({ flashMessages: [...newFlashMessages] })
    }

    if (showModal) this.props.showModal('UpdateResourceModal')
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
        return '' // 409 errors are an overwrite operation, which spawn a modal but no flash messages
      default:
        return `Unexpected response (${status})!`
    }
  }

  handleUpdateResource = async (rts, group) => {
    const responses = await Promise.all(rts.map(rt => this.updateResource(rt, group)))

    this.updateStateFromServerResponses(responses)
  }

  render() {
    return (
      <div id="importResourceTemplate">
        <UpdateResourceModal messages={this.state.modalMessages}
                             update={this.handleUpdateResource} />
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <ImportFileZone setResourceTemplateCallback={this.setResourceTemplates} />
        <CreateResourceMessages messages={this.state.flashMessages} />
        <TemplateSearch />
        <SinopiaResourceTemplates history={this.props.history} key="sinopia-resource-templates" />
      </div>
    )
  }
}

ImportResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  currentUser: PropTypes.object,
  showModal: PropTypes.func,
  history: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ showModal }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ImportResourceTemplate)
