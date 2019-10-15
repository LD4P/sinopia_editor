// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { resourceToName } from 'Utilities'

import _ from 'lodash'

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
        <div className="modal fade" data-show={this.props.show} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{this.state.titleMessage}</h3>
              </div>
              <div className="modal-body">
                Do you want to overwrite these resource templates?
              </div>
              <div className="modal-footer">
                <button className="btn btn-link" onClick={async () => { await this.props.update(this.state.rts, this.state.group) }}>Yes, overwrite</button>
                <button className="btn btn-link" data-dismiss="modal">No, get me out of here!</button>
              </div>
            </div>
          </div>
        </div>
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
