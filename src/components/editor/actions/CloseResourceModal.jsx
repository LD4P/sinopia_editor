// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { hideModal } from 'actions/modals'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import ModalWrapper, { useDisplayStyle, useModalCss } from '../../ModalWrapper'
import { modalType } from 'selectors/modalSelectors'

const CloseResourceModal = (props) => {
  const dispatch = useDispatch()

  const show = useSelector(state => modalType(state) === 'CloseResourceModal')

  const jquerySelector = window.$('#close-resource-modal')

  if (show && jquerySelector.modal) jquerySelector.modal('show')

  const handleClose = (event) => {
    if (jquerySelector.modal) jquerySelector.modal('hide')
    dispatch(hideModal())
    event.preventDefault()
  }

  const handleCloseResource = (event) => {
    props.closeResource()
    if (jquerySelector.modal) jquerySelector.modal('hide')
    dispatch(hideModal())
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
  closeResource: PropTypes.func,
}

export default CloseResourceModal
