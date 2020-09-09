// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { hideModal } from 'actions/modals'
import { useDispatch, useSelector } from 'react-redux'
import { clearResource } from 'actions/resources'
import ModalWrapper, { useDisplayStyle, useModalCss } from '../../ModalWrapper'
import { selectModalType } from 'selectors/modals'
import { useHistory } from 'react-router-dom'

const CloseResourceModal = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const show = useSelector((state) => selectModalType(state) === 'CloseResourceModal')

  const handleClose = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const handleCloseResource = (event) => {
    dispatch(clearResource(props.resourceKey))
    dispatch(hideModal())
    // In case this is /editor/<rtId>, clear
    history.push('/editor')
    event.preventDefault()
  }

  const modal = (
    <div className={ useModalCss(show) }
         id="close-resource-modal"
         data-testid="close-resource-modal"
         tabIndex="-1"
         role="dialog"
         style={{ display: useDisplayStyle(show) }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header" data-testid="close-resource-modal-header">
            <h4 className="modal-title">Resource has unsaved changes. Are you sure you want to close?</h4>
            <button type="button" className="close" onClick={handleClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body rdf-modal-content">
            <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
              <button className="btn btn-link btn-sm" data-dismiss="modal" style={{ paddingRight: '20px' }} onClick={ handleClose }>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" data-dismiss="modal" onClick={ handleCloseResource }>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>)

  return (<ModalWrapper modal={modal} />)
}

CloseResourceModal.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default CloseResourceModal
