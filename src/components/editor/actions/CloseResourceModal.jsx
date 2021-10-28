// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { hideModal } from "actions/modals"
import { useDispatch, useSelector } from "react-redux"
import ModalWrapper, { useDisplayStyle, useModalCss } from "../../ModalWrapper"
import { isCurrentModal } from "selectors/modals"
import useEditor from "hooks/useEditor"

const CloseResourceModal = ({ resourceKey }) => {
  const dispatch = useDispatch()
  const { handleCloseResource } = useEditor(resourceKey)

  const show = useSelector((state) =>
    isCurrentModal(state, `CloseResourceModal-${resourceKey}`)
  )

  const handleClose = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const handleCloseResourceClick = (event) => {
    dispatch(hideModal())
    handleCloseResource(event)
  }

  const modal = (
    <div
      className={useModalCss(show)}
      id="close-resource-modal"
      data-testid="close-resource-modal"
      tabIndex="-1"
      role="dialog"
      style={{ display: useDisplayStyle(show) }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div
            className="modal-header"
            data-testid="close-resource-modal-header"
          >
            <h4 className="modal-title">
              Resource has unsaved changes. Are you sure you want to close?
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body rdf-modal-content">
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
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

CloseResourceModal.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default CloseResourceModal
