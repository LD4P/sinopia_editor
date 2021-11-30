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
import ResourcePreviewHeader from "./ResourcePreviewHeader"

const VersionPreviewModal = () => {
  const dispatch = useDispatch()

  // Ensure there is a current resource before attempting to render a resource component
  const currentResourceKey = useSelector((state) =>
    selectCurrentPreviewResourceKey(state)
  )
  const currentResource = useSelector((state) =>
    selectNormSubject(state, currentResourceKey)
  )

  const close = (event) => {
    event.preventDefault()
    dispatch(setCurrentPreviewResource(null))
    dispatch(hideModal())
    dispatch(clearResource(currentResourceKey))
  }

  const header = (
    <h4 className="modal-title" id="view-resource-modal-title">
      Preview Resource Version
    </h4>
  )

  const body = currentResource ? (
    <React.Fragment>
      <ResourcePreviewHeader resource={currentResource} />
      <ResourceDisplay
        resourceKey={currentResourceKey}
        displayRelationships={false}
      />
    </React.Fragment>
  ) : null

  return (
    <ModalWrapper
      modalName="VersionPreviewModal"
      ariaLabel="Preview resource version"
      data-testid="view-resource-modal"
      handleClose={close}
      header={header}
      body={body}
      size="lg"
    />
  )
}

export default VersionPreviewModal
