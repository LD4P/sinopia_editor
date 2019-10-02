// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'
import Config from 'Config'
import { closeGroupChooser, showRdfPreview } from 'actions/index'
import { getCurrentUser } from 'authSelectors'
import { publishResource } from 'actionCreators/resources'

const GroupChoiceModal = (props) => {
  // The ld4p group is only for templates
  const groups = Object.entries(Config.groupsInSinopia)
    .filter(([groupSlug]) => groupSlug !== 'ld4p')
    .sort(([, groupLabelA], [, groupLabelB]) => groupLabelA.localeCompare(groupLabelB))

  const [selectedValue, setSelectedValue] = useState(groups[0][0])

  const updateSelectedValue = (event) => {
    setSelectedValue(event.target.value)
  }

  const saveAndClose = () => {
    props.publishResource(props.currentUser, selectedValue)
    props.showRdfPreview(false)
    props.closeGroupChooser(false)
  }

  return (
    <div>
      <Modal show={ props.show } onHide={ () => props.closeGroupChooser(false) } bsSize="lg">
        <Modal.Header className="prop-heading" closeButton>
          <Modal.Title>
            Which group do you want to save to?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="group-panel">
          <form className="group-select-options" >
            <div className="form-group">
              <label className="group-select-label" htmlFor="groupSelect">Which group do you want to associate this record to?</label>
              <select data-testid="groupSelect" id="groupSelect" defaultValue={ selectedValue } onBlur={ event => updateSelectedValue(event)} >
                { groups.map((group, index) => <option key={index} value={ group[0] }>{ group[1] }</option>) }
              </select>
            </div>
            <div className="group-choose-buttons">
              <Button bsStyle="link" style={{ paddingRight: '20px' }} onClick={ () => props.closeGroupChooser(false) }>
                Cancel
              </Button>
              <Button bsStyle="primary" bsSize="small" onClick={ saveAndClose }>
                Save
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

GroupChoiceModal.propTypes = {
  closeGroupChooser: PropTypes.func,
  showRdfPreview: PropTypes.func,
  choose: PropTypes.func,
  show: PropTypes.bool,
  currentUser: PropTypes.object,
  publishResource: PropTypes.func,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.groupChoice.show,
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ closeGroupChooser, showRdfPreview, publishResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GroupChoiceModal)
