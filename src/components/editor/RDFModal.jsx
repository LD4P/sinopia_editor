// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import PropTypes from 'prop-types'
import GraphBuilder from 'GraphBuilder'
import { showRdfPreview } from 'actions/index'
import SaveAndPublishButton from './SaveAndPublishButton'

const RDFModal = (props) => {
  if (!props.show) {
    return null
  }

  return (<div>
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
            <SaveAndPublishButton id="modal-save" />
          </Col>
        </Row>
        <pre style={{ marginTop: '10px' }}>{ props.rdf() }</pre>
      </Modal.Body>
    </Modal>
  </div>)
}

RDFModal.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  save: PropTypes.func,
  rtId: PropTypes.string,
  rdf: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.rdfPreview.show,
  rdf: () => new GraphBuilder(state.selectorReducer).graph.toCanonical(),
})

const mapDispatchToProps = dispatch => ({
  close() {
    dispatch(showRdfPreview(false))
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(RDFModal)
