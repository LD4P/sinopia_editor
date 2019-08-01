// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'
import GraphBuilder from 'GraphBuilder'
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
    props.publishMyResource(props.currentUser, selectedValue)
    props.closeRdfPreview()
    props.close()
  }

  if (props.error) {
    // the error will be displayed via Editor -> ErrorMessages components
    return (<div />)
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
                <Button bsStyle="link" style={{ paddingRight: '20px' }} onClick={ props.close }>
                  Cancel
                </Button>
                <Button bsStyle="primary" bsSize="small" onClick={ saveAndClose }>
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
  closeRdfPreview: PropTypes.func,
  choose: PropTypes.func,
  show: PropTypes.bool,
  rdf: PropTypes.func,
  currentUser: PropTypes.object,
  publishMyResource: PropTypes.func,
  error: PropTypes.string,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.groupChoice.show,
  rdf: () => new GraphBuilder(state.selectorReducer).graph.toCanonical(),
  currentUser: getCurrentUser(state),
  error: state.selectorReducer.editor.serverError,
})

const mapDispatchToProps = dispatch => ({
  close() {
    dispatch(closeGroupChooser(false))
  },
  closeRdfPreview() {
    dispatch(showRdfPreview(false))
  },
  publishMyResource: (user, group) => {
    dispatch(publishResource(user, group))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupChoiceModal)
