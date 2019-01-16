// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'

class RDFModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const json = JSON.parse(this.props.rdfData)
    const rdf = json.rdf
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title>RDF Preview ({this.props.rtId})</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { rdf }
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
  rdfData: PropTypes.string.isRequired,
  rtId: PropTypes.string,
  show: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default RDFModal