// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import ModalWrapper, {
  useDisplayStyle,
  useModalCss,
} from "components/ModalWrapper"
import { hideModal } from "actions/modals"
import { isCurrentModal } from "selectors/modals"
import {
  selectCurrentPreviewResourceKey,
  selectNormSubject,
} from "selectors/resources"
import { setCurrentPreviewResource, clearResource } from "actions/resources"
import ResourceDisplay from "./ResourceDisplay"
import usePermissions from "hooks/usePermissions"
import MarcButton from "../actions/MarcButton"
import TransferButtons from "../actions/TransferButtons"
import ResourcePreviewHeader from "./ResourcePreviewHeader"
import useResource from "hooks/useResource"
import CopyButton from "../../buttons/CopyButton"
import EditButton from "../../buttons/EditButton"

const PreviewModal = ({ errorKey }) => {
  const dispatch = useDispatch()
  const { canEdit, canCreate } = usePermissions()
  const show = useSelector((state) => isCurrentModal(state, "PreviewModal"))

  // Ensure there is a current resource before attempting to render a resource component
  const currentResourceKey = useSelector((state) =>
    selectCurrentPreviewResourceKey(state)
  )
  const currentResource = useSelector((state) =>
    selectNormSubject(state, currentResourceKey)
  )

  const { handleEdit, handleCopy, isLoadingEdit, isLoadingCopy } = useResource(
    errorKey,
    { resourceURI: currentResource?.uri }
  )

  const close = (event) => {
    event.preventDefault()
    dispatch(setCurrentPreviewResource(null))
    dispatch(hideModal())
  }

  const handleEditClick = (event) => {
    close(event)
    handleEdit()
  }

  const handleCopyClick = (event) => {
    close(event)
    handleCopy()
  }

  const handleCloseClick = (event) => {
    close(event)
    dispatch(clearResource(currentResourceKey))
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
        className="modal-dialog modal-xl modal-dialog-scrollable"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="view-resource-modal-title">
              Preview Resource
            </h4>
            <div className="view-resource-buttons">
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseClick}
                aria-label="Close"
              ></button>
            </div>
          </div>
          <div className="modal-body view-resource-modal-content">
            {currentResource && (
              <>
                <ResourcePreviewHeader resource={currentResource} />
                <ResourceDisplay
                  resourceKey={currentResourceKey}
                  errorKey={errorKey}
                />
              </>
            )}
          </div>
          <div className="modal-footer">
            {currentResourceKey && (
              <MarcButton resourceKey={currentResourceKey} />
            )}
            {currentResourceKey && (
              <TransferButtons resourceKey={currentResourceKey} />
            )}
            {canEdit(currentResource) && (
              <EditButton
                handleClick={handleEditClick}
                label={currentResource.label}
                isLoading={isLoadingEdit}
              />
            )}
            {currentResource && canCreate && (
              <CopyButton
                handleClick={handleCopyClick}
                label={currentResource.label}
                isLoading={isLoadingCopy}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

PreviewModal.propTypes = {
  errorKey: PropTypes.string.isRequired,
}

export default PreviewModal
