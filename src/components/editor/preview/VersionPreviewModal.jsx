// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
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
import ResourcePreviewHeader from "./ResourcePreviewHeader"

const VersionPreviewModal = () => {
  const dispatch = useDispatch()
  const show = useSelector((state) =>
    isCurrentModal(state, "VersionPreviewModal")
  )

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
              Preview Resource Version
            </h4>
            <div className="view-resource-buttons">
              <button
                type="button"
                className="btn-close"
                onClick={close}
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
                  displayRelationships={false}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

export default VersionPreviewModal
