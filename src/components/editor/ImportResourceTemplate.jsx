// Copyright 2018 Stanford University see Apache2.txt for license

import SinopiaServer from 'sinopia_server'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import ImportFileZone from './ImportFileZone'
import SinopiaResourceTemplates from './SinopiaResourceTemplates'
import UpdateResourceModal from './UpdateResourceModal'
import Config from '../../../src/Config'
import CognitoUtils from '../../../src/CognitoUtils'
import { connect } from 'react-redux'

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

    this.instance.apiClient.basePath = Config.sinopiaServerBase
  }

  componentDidMount() {
    const incrementedKey = this.state.updateKey + 1
    // This causes the `SinopiaResourceTemplates` component to do the initial load of RTs
    this.setState({ updateKey: incrementedKey })
  }

  modalClose = () => {
    this.setState({
      modalShow: false
    })
  }

  // Resource templates are set via ImportFileZone and passed to ResourceTemplate via redirect to Editor
  setResourceTemplates = (content, group) => {
    const profileCount = content.Profile.resourceTemplates.length
    content.Profile.resourceTemplates.forEach(async rt => {
      const response = await this.createResource(rt, group)
      const incrementedKey = this.state.updateKey + 1
      this.updateStateFromServerResponse(response, profileCount, incrementedKey)
    })
  }

  createResource = async (content, group) => {
    try {
      // first, make sure the client instance has a valid JWT id token set
      await CognitoUtils.getIdTokenString(this.props.authenticationState.currentUser)
              .then((idToken) => this.instance.apiClient.authentications['CognitoUser'].accessToken = idToken)
    } catch(error) {
      // TODO: add auth-related error handling similar to the catch on the createResourceWithHttpInfo try below, e.g.
      // * display a warning that the operation failed due to error with current session
      //   * add action and reducer for session expired, have LoginPanel display specific err msg.  reducer should clear session (and
      //     user as needed) so the login panel goes back to the not logged in state.  highlight LoginPanel or something too (along w/ the err msg).
      //   * user logs in via login panel again.  app state now has a valid cognito user with a valid session.
      //   * user tries to do this action again, now that they have a valid sesison, hopefully succeeds.
      return error
    }

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

  updateStateFromServerResponse = (response, profileCount, updateKey) => {
    // HTTP status 409 == Conflict
    const showModal = response.status === 409 && this.state.createResourceError.length >= profileCount

    const location = response.headers.location || ''
    const newMessage = `${this.humanReadableStatus(response.status)} ${location}`
    const newState = {
      message: [...this.state.message, newMessage],
      updateKey: updateKey
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
      const incrementedKey = this.state.updateKey + 1
      // The 0 is the profileCount which is only used for tracking create errors
      this.updateStateFromServerResponse(response, 0, incrementedKey)
    })
    this.modalClose()
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
  triggerHandleOffsetMenu: PropTypes.func,
  authenticationState: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    authenticationState: Object.assign({}, state.authenticate.authenticationState)
  }
}

//TODO: likely to end up wiring up auth error reporting via redux dispatch
// const mapDispatchToProps = dispatch => {
//   return { }
// }


export default connect(mapStateToProps)(ImportResourceTemplate)
// export default connect(mapStateToProps, mapDispatchToProps)(ImportResourceTemplate)
