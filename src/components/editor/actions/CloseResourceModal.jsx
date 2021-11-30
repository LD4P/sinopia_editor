// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { hideModal } from "actions/modals"
import { useDispatch } from "react-redux"
import ModalWrapper from "../../ModalWrapper"
import useEditor from "hooks/useEditor"

const CloseResourceModal = ({ resourceKey }) => {
  const dispatch = useDispatch()
  const { handleCloseResource } = useEditor(resourceKey)

  const handleClose = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const handleCloseResourceClick = (event) => {
    dispatch(hideModal())
    handleCloseResource(event)
  }

  const header = (
    <h4 className="modal-title">
      Resource has unsaved changes. Are you sure you want to close?
    </h4>
  )

  const body = (
    <div className="row">
      <div className="col">
        <button
          className="btn btn-link btn-sm"
          data-dismiss="modal"
          style={{ paddingRight: "20px" }}
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary btn-sm"
          data-dismiss="modal"
          onClick={handleCloseResourceClick}
        >
          Close
        </button>
      </div>
    </div>
  )

  return (
    <ModalWrapper
      modalName={`CloseResourceModal-${resourceKey}`}
      header={header}
      body={body}
      data-testid="close-resource-modal"
      ariaLabel="Close resource"
    />
  )
}

CloseResourceModal.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default CloseResourceModal
