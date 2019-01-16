// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'
import JSONPretty from 'react-json-pretty'

class RDFModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const json = JSON.parse(this.props.linkedData)
    const jsonld = json.jsonld
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title>RDF Preview ({this.props.rtId})</Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={"rdf-modal-content"}>
            <JSONPretty id="json-pretty" data={jsonld} />
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
  linkedData: PropTypes.string,
  rtId: PropTypes.string,
  show: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default RDFModal