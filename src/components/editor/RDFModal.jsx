// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'
import JSONPretty from 'react-json-pretty'
import { connect } from 'react-redux'
import { getAllRdf } from '../../reducers/index'

class RDFModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // TODO: Fix as part of issue #481 - make this jsonld with correct RDF
    const json = JSON.stringify(this.props.rdf) // NOTE: currently just json, not jsonld
    // const jsonld = json.jsonld

    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title>RDF Preview ({this.props.rtId})</Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={'rdf-modal-content'}>
            {/* <JSONPretty id="json-pretty" data={jsonld} /> */}
            <JSONPretty id="json-pretty" data={json} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

RDFModal.propTypes = {
  close: PropTypes.func,
  rtId: PropTypes.string,
  show: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  rdf: PropTypes.object,
}

const mapStateToProps = (state, props) => {
  const result = getAllRdf(state, props)


  return { rdf: result }
}

export default connect(mapStateToProps, null)(RDFModal)
