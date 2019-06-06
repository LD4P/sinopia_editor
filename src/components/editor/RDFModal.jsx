// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import PropTypes from 'prop-types'

const RDFModal = props => (
  <div>
    <Modal show={true} bsSize="lg" onHide={props.close}>
      <Modal.Header closeButton>
        <Modal.Title>
          RDF Preview
        </Modal.Title>
      </Modal.Header>
      <Modal.Body bsClass={'rdf-modal-content'}>
        <Row style={{ marginLeft: '0', marginRight: '0' }}>
          <Col sm={6}>If this looks good, then click Save and Publish</Col>
          <Col style={{ textAlign: 'right' }}>
            <Button className="btn btn-primary btn-sm" onClick={ props.save }>
              Save & Publish
            </Button>
          </Col>
        </Row>
        <pre style={{ marginTop: '10px' }}>{ props.rdf() }</pre>
      </Modal.Body>
    </Modal>
  </div>
)

RDFModal.propTypes = {
  close: PropTypes.func,
  save: PropTypes.func,
  rtId: PropTypes.string,
  rdf: PropTypes.func,
}

export default RDFModal
