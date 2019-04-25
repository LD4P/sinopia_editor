// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import ImportFileZone from './ImportFileZone'
import SinopiaResourceTemplates from './SinopiaResourceTemplates'
import UpdateResourceModal from './UpdateResourceModal'
import { loadState } from '../../localStorage'
import Config from '../../../src/Config'
const SinopiaServer = require('sinopia_server')
const instance = new SinopiaServer.LDPApi()
const curJwt = loadState('jwtAuth')
const _ = require('lodash')
instance.apiClient.basePath = Config.sinopiaServerBase
if (curJwt !== undefined) {
  instance.apiClient.authentications['CognitoUser'].accessToken = curJwt.id_token
}

class ImportResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      group: '',
      message: [],
      createResourceError: [],
      updateResourceError: '',
      updateKey: 0,
      modalShow: false
    }
  }

  componentDidMount() {
    const incrementedKey = this.state.updateKey +1
    this.setState({updateKey: incrementedKey})
  }

  modalClose = () => {
    this.setState( { modalShow: false } )
  }

  //resource templates are set via ImportFileZone and passed to ResourceTemplate via redirect to Editor
  setResourceTemplates = (content, group) => {
    const profileCount = content.Profile.resourceTemplates.length
    content.Profile.resourceTemplates.map(rt => {
      this.fulfillCreateResourcePromise(this.createResourcePromise(rt, group, profileCount))
      const incrementedKey = this.state.updateKey + 1
      this.setState({updateKey: incrementedKey})
    })
  }

  createResourcePromise = (content, group, profileCount) => new Promise(async (resolve) => {
    resolve(
      await instance.createResourceWithHttpInfo(group, content, { slug: content.id, contentType: 'application/json' }).catch((error) => {
        this.updateStateForResourceError(error)
      })
    )
  }).then(response => {
    if(this.state.createResourceError.length === profileCount) {
      this.setState({modalShow: true})
    }
    return response
  }).catch(() => {})

  updateResourcePromise = (content, group) => new Promise(async (resolve) => {
    resolve(
      await instance.updateResourceWithHttpInfo(group, content.id, content, { contentType: 'application/json' }).catch((error) => {
        this.setState({
          updateResourceError: error
        })
      })
    )
  }).then(response => {

    return response
  }).catch(() => {})

  fulfillCreateResourcePromise = async (promise) => {
    await promise.then(result => {
      const joinedMessages = this.state.message.slice(0)

      if(result.response.statusText !== 'No Content') {
        this.setState({tempState: `${result.response.statusText} ${result.response.headers.location}`})
        joinedMessages.push(this.state.tempState)
        this.setState({message: joinedMessages})
      }

    }).catch(() => {
      if (this.state.createResourceError[0].statusText !== 'Conflict') {
        const msg = 'The sinopia server is not accepting the request for this resource.'
        this.state.updateResourceError ? this.setState({message: [`${msg}: ${this.state.updateResourceError}`]}) : this.setState({message: [msg]})
      }
    })
  }

  updateStateForResourceError = (error) => {
    if(_.get(error, 'response.statusText') === 'Conflict') {
      const response = error.response
      const joinedConflicts = this.state.createResourceError.slice(0)
      this.setState({tempConflictError: response})
      joinedConflicts.push(this.state.tempConflictError)
      this.setState({createResourceError: joinedConflicts})
    }
  }

  updateAllResources = (rts, group) => {
    return Promise.all(rts.map(async rt =>
      await this.fulfillCreateResourcePromise(this.updateResourcePromise(rt, group))
    ))
  }

  handleUpdateResource = async (rts, group) => {
    await this.updateAllResources(rts, group).then(() => {
      const incrementedKey = this.state.updateKey + 1
      this.setState({updateKey: incrementedKey})
      this.modalClose()
      window.location.reload()
    })
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

export default (ImportResourceTemplate)
