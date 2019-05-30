// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'
import { getAllRdf } from '../../reducers/index'
import { connect } from 'react-redux'

class RDFModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Modal show={this.props.show} bsSize="lg">
          <Modal.Header>
            <Modal.Title>RDF Preview ({this.props.rtId})</Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={'rdf-modal-content'}>
            <pre>{this.props.rdf}</pre>
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
  rdf: PropTypes.string,
}

const mapStateToProps = (state, props) => {
  const result = getAllRdf(state, props)


  return { rdf: result }
}

export default connect(mapStateToProps, null)(RDFModal)
