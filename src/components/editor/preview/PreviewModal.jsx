// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import ModalWrapper, { useDisplayStyle, useModalCss } from "components/ModalWrapper"
import { hideModal } from "actions/modals"
import { selectModalType } from "selectors/modals"
import { selectCurrentPreviewResourceKey, selectNormSubject } from "selectors/resources"
import { setCurrentPreviewResource } from "../../../actions/resources"
import ResourceDisplay from "./ResourceDisplay"
import usePermissions from "hooks/usePermissions"
import MarcButton from "../actions/MarcButton"
import TransferButtons from "../actions/TransferButtons"
import ResourcePreviewHeader from "./ResourcePreviewHeader"

const PreviewModal = (props) => {
  const dispatch = useDispatch()
  const { canEdit, canCreate } = usePermissions()
  const show = useSelector((state) => selectModalType(state) === "PreviewModal")

  // Ensure there is a current resource before attempting to render a resource component
  const currentResourceKey = useSelector((state) => selectCurrentPreviewResourceKey(state))
  const currentResource = useSelector((state) => selectNormSubject(state, currentResourceKey))

  const close = (event) => {
    event.preventDefault()
    dispatch(setCurrentPreviewResource(null))
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
      <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="view-resource-modal-title">
              Preview Resource
            </h4>
            <div className="view-resource-buttons">
              <button type="button" className="btn-close" onClick={close} aria-label="Close"></button>
            </div>
          </div>
          <div className="modal-body view-resource-modal-content">
            {currentResource && (
              <>
                <ResourcePreviewHeader resource={currentResource} />
                <ResourceDisplay resourceKey={currentResourceKey} />
              </>
            )}
          </div>
          <div className="modal-footer">
            {currentResourceKey && <MarcButton resourceKey={currentResourceKey} />}
            {currentResourceKey && <TransferButtons resourceKey={currentResourceKey} />}
            {canEdit(currentResource) && (
              <button
                className="btn btn-primary btn-view-resource"
                onClick={editAndClose}
                aria-label="Edit"
                data-testid="edit-resource"
              >
                Edit
              </button>
            )}
            {canCreate && (
              <button
                className="btn btn-primary btn-view-resource"
                onClick={copyAndClose}
                aria-label="Copy"
                data-testid="copy-resource"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

PreviewModal.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
}

export default PreviewModal
