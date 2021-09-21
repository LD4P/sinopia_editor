// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy, faEdit } from "@fortawesome/free-solid-svg-icons"
import ModalWrapper, {
  useDisplayStyle,
  useModalCss,
} from "components/ModalWrapper"
import { hideModal } from "actions/modals"
import { setCurrentResourceIsReadOnly } from "actions/resources"
import { selectModalType } from "selectors/modals"
import {
  selectCurrentResourceKey,
  selectNormSubject,
} from "selectors/resources"
import ResourceComponent from "./editor/ResourceComponent"
import usePermissions from "hooks/usePermissions"

const ViewResourceModal = (props) => {
  const dispatch = useDispatch()
  const { canEdit, canCreate } = usePermissions()

  const show = useSelector(
    (state) => selectModalType(state) === "ViewResourceModal"
  )

  // Ensure there is a current resource before attempting to render a resource component
  const currentResourceKey = useSelector((state) =>
    selectCurrentResourceKey(state)
  )
  const currentResource = useSelector((state) =>
    selectNormSubject(state, currentResourceKey)
  )

  const close = (event) => {
    event.preventDefault()
    dispatch(setCurrentResourceIsReadOnly(false))
    dispatch(hideModal())
  }

  const editAndClose = (event) => {
    close(event)
    props.handleEdit(currentResource.uri)
  }

  const copyAndClose = (event) => {
    close(event)
    props.handleCopy(currentResource.uri)
  }

  const modal = (
    <div
      className={useModalCss(show)}
      tabIndex="-1"
      role="dialog"
      id="view-resource-modal"
      data-testid="view-resource-modal"
      aria-labelledby="view-resource-modal-title"
      style={{ display: useDisplayStyle(show) }}
    >
      <div
        className="modal-dialog modal-dialog-scrollable view-resource-modal-dialog modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="view-resource-modal-title">
              View Resource
            </h4>
            <div className="view-resource-buttons">
              <button
                type="button"
                className="close modal-close"
                onClick={close}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div className="modal-body view-resource-modal-content">
            {currentResource && <ResourceComponent />}
          </div>
          <div className="modal-footer">
            {canEdit(currentResource) && (
              <button
                className="btn btn-primary btn-view-resource"
                onClick={editAndClose}
                aria-label="Edit"
                data-testid="edit-resource"
              >
                <FontAwesomeIcon icon={faEdit} />
                &nbsp; Edit
              </button>
            )}
            {canCreate && (
              <button
                className="btn btn-primary btn-view-resource"
                onClick={copyAndClose}
                aria-label="Copy"
                data-testid="copy-resource"
              >
                <FontAwesomeIcon icon={faCopy} />
                &nbsp; Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

ViewResourceModal.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
}

export default ViewResourceModal
