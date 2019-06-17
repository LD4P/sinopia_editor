// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import { resourceToName } from 'Utilities'

const _ = require('lodash')

class UpdateResourceModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      titleMessage: [],
      rts: [],
    }
  }

  componentDidMount() {
    let group = ''
    const rts = []
    const titleMessages = []
    const messages = this.props.messages

    messages.map((message) => {
      if (_.get(message, 'req._data.id')) {
        const req = message.req

        group = resourceToName(req.url)
        const rt = req._data

        rts.push(rt)
        titleMessages.push(`${rt.id} already exists`)
      }
    })

    this.setState({
      titleMessage: titleMessages.join(', '),
      rts,
      group,
    })
  }

  render() {
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title>{this.state.titleMessage}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to overwrite these resource templates?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={async () => { await this.props.update(this.state.rts, this.state.group) }}>Yes, overwrite</Button>
            <Button onClick={this.props.close}>No, get me out of here!</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

UpdateResourceModal.propTypes = {
  close: PropTypes.func,
  show: PropTypes.bool,
  messages: PropTypes.array,
  update: PropTypes.func,
}

export default UpdateResourceModal
