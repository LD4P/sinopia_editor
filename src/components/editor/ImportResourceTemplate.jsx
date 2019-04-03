// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import ImportFileZone from './ImportFileZone'
import SinopiaResourceTemplates from './SinopiaResourceTemplates'
import { loadState } from '../../localStorage'
import Config from '../../../src/Config'
const SinopiaServer = require('sinopia_server')
const instance = new SinopiaServer.LDPApi()
const curJwt = loadState('jwtAuth')
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
      updateKey: 0
    }
  }

  componentDidMount() {
    const incrementedKey = this.state.updateKey +1
    this.setState({updateKey: incrementedKey})
  }

  //resource templates are set via ImportFileZone and passed to ResourceTemplate via redirect to Editor
  setResourceTemplates = (content, group) => {
    content.Profile.resourceTemplates.map(rt => {
      this.fulfillCreateResourcePromise(this.createResourcePromise(rt, group))
      const incrementedKey = this.state.updateKey + 1
      this.setState({updateKey: incrementedKey})
    })
  }

  createResourcePromise = (content, group) => new Promise(async (resolve) => {
    resolve(await instance.createResourceWithHttpInfo(group, content, { slug: content.id, contentType: 'application/json' }))
  }).then(response => {
    return response
  }).catch(() => {})

  fulfillCreateResourcePromise = (promise) => {
    promise.then(result => {
      const joinedMessages = this.state.message.slice(0)
      this.setState({tempState: `${result.response.statusText} ${result.response.headers.location}`})
      joinedMessages.push(this.state.tempState)
      this.setState({message: joinedMessages})
    }).catch(() => {
      this.setState({message: ['Cannot create resource. It is likely that the sinopia server is either not running or accepting requests.']})
    })
  }

  render() {
    return(
      <div id="importResourceTemplate">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <ImportFileZone setResourceTemplateCallback={this.setResourceTemplates} />
        <SinopiaResourceTemplates updateKey={this.state.updateKey} message={this.state.message}/>
      </div>
    )
  }
}

ImportResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func
}

export default (ImportResourceTemplate)
