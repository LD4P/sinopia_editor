// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useDispatch, useSelector } from "react-redux"
import ModalWrapper from "components/ModalWrapper"
import { hideModal } from "actions/modals"
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
import useAlerts from "hooks/useAlerts"

const PreviewModal = () => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const { canEdit, canCreate } = usePermissions()

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

  const header = (
    <h4 className="modal-title" id="view-resource-modal-title">
      Preview Resource
    </h4>
  )

  const body = currentResource ? (
    <React.Fragment>
      <ResourcePreviewHeader resource={currentResource} />
      <ResourceDisplay resourceKey={currentResourceKey} />
    </React.Fragment>
  ) : null

  const footer = (
    <React.Fragment>
      {currentResourceKey && <MarcButton resourceKey={currentResourceKey} />}
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
    </React.Fragment>
  )

  return (
    <ModalWrapper
      modalName="PreviewModal"
      header={header}
      body={body}
      footer={footer}
      size="lg"
      data-testid="view-resource-modal"
      ariaLabel="Preview resource"
      handleClose={handleCloseClick}
    />
  )
}

export default PreviewModal
