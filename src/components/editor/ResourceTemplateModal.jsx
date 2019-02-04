// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { getLD } from '../../actions/index'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import ResourceTemplateForm from './ResourceTemplateForm'

class ResourceTemplateModal extends Component {
  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose = () => {
    this.props.toggleVisibility()
  }

  render() {
    let rtId = this.props.rtId
    return (
      <div>
        <Modal id={this.props.modalId} className='ResourceTemplateModal' show={this.props.visible} onHide={this.handleClose} >
          <Modal.Header closeButton>
            <Modal.Title>{rtId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ResourceTemplateForm
              propertyTemplates = {this.props.propertyTemplates}
              resourceTemplate = {this.props.resourceTemplate}
              rdfOuterSubject={this.props.rdfOuterSubject}
              propPredicate={this.props.propPredicate}
              rtId={this.props.rtId}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

ResourceTemplateModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  propertyTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceTemplate: PropTypes.object.isRequired,
  rtId: PropTypes.string.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  rdfOuterSubject: PropTypes.object,
  propPredicate: PropTypes.string
}

const mapDispatchToProps = dispatch => (
  {
    handleGenerateLD(inputs){
      dispatch(getLD(inputs))
    }
  })

export default connect(null, mapDispatchToProps)(ResourceTemplateModal)
