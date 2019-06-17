// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'
import GraphBuilder from 'GraphBuilder'
import Config from 'Config'

const GroupChoiceModal = (props) => {
  const [selectedValue, setSelectedValue] = useState('ld4p')

  // The ld4p group is only for templates
  const groups = Config.groupsInSinopia.filter(group => group[0] !== 'ld4p')

  const updateSelectedValue = (event) => {
    setSelectedValue(event.target.value)
  }

  const saveAndClose = () => {
    props.save(props.rdf(), selectedValue)
  }

  return (
    <div>
      <Modal show={ props.show } onHide={ props.close } bsSize="lg">
        <Modal.Header className="prop-heading" closeButton>
          <Modal.Title>
            Which group do you want to save to?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="group-panel">
          <div className="group-select-label">
            Which group do you want to associate this record to?
          </div>
          <div>
            <form className="group-select-options" >
              <select defaultValue={ selectedValue } onBlur={ event => updateSelectedValue(event)} >
                { groups.map((group, index) => <option key={index} value={ group[0] }>{ group[1] }</option>) }
              </select>
              <div className="group-choose-buttons">
                <Button className="btn-link" style={{ paddingRight: '20px' }} onClick={ props.close }>
                  Cancel
                </Button>
                <Button className="btn btn-primary btn-sm" onClick={ saveAndClose }>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

GroupChoiceModal.propTypes = {
  close: PropTypes.func,
  save: PropTypes.func,
  choose: PropTypes.func,
  show: PropTypes.bool,
  rdf: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.groupChoice.show,
  rdf: () => new GraphBuilder(state.selectorReducer).graph.toString(),
})

export default connect(mapStateToProps, {})(GroupChoiceModal)
