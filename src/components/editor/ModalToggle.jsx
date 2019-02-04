// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ResourceTemplateModal from './ResourceTemplateModal'

class ModalToggle extends Component {
  constructor(props) {
    super(props)
    this.toggleModal = this.toggleModal.bind(this)
    this.state = {
      visible: false
    }
  }

  toggleModal = () => {
    const prevState = this.state
    prevState.visible = !prevState.visible
    this.setState(prevState => (prevState))
  }

  render() {
    const rtId = this.props.rtId
    const modalId = `#modal-${rtId}`
    return (
      <div className='modalToggle'>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={this.toggleModal}
          data-toggle="modal"
          data-target={modalId}>{this.props.buttonLabel}</button>
        <ResourceTemplateModal
          modalId={modalId}
          rtId={rtId}
          resourceTemplate={this.props.resourceTemplate}
          propertyTemplates={this.props.propertyTemplates}
          visible={this.state.visible}
          toggleVisibility={this.toggleModal}
          rdfOuterSubject={this.props.rdfOuterSubject}
          propPredicate={this.props.propPredicate}
        />
      </div>
    )
  }
}

ModalToggle.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  propertyTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceTemplate: PropTypes.object.isRequired,
  rtId: PropTypes.string.isRequired,
  rdfOuterSubject: PropTypes.object,
  propPredicate: PropTypes.string,
}

export default ModalToggle
