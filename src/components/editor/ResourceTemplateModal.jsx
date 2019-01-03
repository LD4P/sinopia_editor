// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import ResourceTemplateForm from './ResourceTemplateForm'

class ResourceTemplateModal extends Component {
  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.saveDataFromModal = this.saveDataFromModal.bind(this)
  }

  handleClose = () => {
    this.props.toggleVisibility()
  }

  handleSave = () => {
    this.saveDataFromModal()
    this.handleClose()
  }

  saveDataFromModal = () => {
    console.log('TODO: implement holding data from ResourceTemplateModal')
  }

  render() {
    let rtId = this.props.rtId
    return (
      <Modal id={this.props.modalId} className='ResourceTemplateModal' show={this.props.visible} onHide={this.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>{rtId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ResourceTemplateForm propertyTemplates = {this.props.propertyTemplates}
            rtType = {this.props.rtType} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

ResourceTemplateModal.propTypes = {
  modalId: PropTypes.string.isRequired,
  propertyTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  rtId: PropTypes.string.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
}

export default ResourceTemplateModal
