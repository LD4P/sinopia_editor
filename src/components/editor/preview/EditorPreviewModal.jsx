// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { isCurrentModal } from "selectors/modals"
import { hideModal } from "actions/modals"
import ModalWrapper, { useDisplayStyle, useModalCss } from "../../ModalWrapper"
import SaveAndPublishButton from "../actions/SaveAndPublishButton"
import ResourceDisplay from "./ResourceDisplay"
import { selectCurrentResourceKey } from "selectors/resources"
import { resourceEditWarningKey } from "../Editor"

const EditorPreviewModal = () => {
  const dispatch = useDispatch()
  const show = useSelector((state) => isCurrentModal(state, "RDFModal"))
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))

  const handleClose = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const modal = (
    <div
      className={useModalCss(show)}
      id="rdf-modal"
      data-testid="rdf-modal"
      tabIndex="-1"
      role="dialog"
      style={{ display: useDisplayStyle(show) }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header" data-testid="rdf-modal-header">
            <h4 className="modal-title">Preview</h4>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body rdf-modal-content">
            {show && (
              <ResourceDisplay
                resourceKey={resourceKey}
                defaultFormat="table"
                displayRelationships={false}
                errorKey={resourceEditWarningKey(resourceKey)}
              />
            )}
          </div>
          <div className="modal-footer">
            <SaveAndPublishButton class="modal-save" />
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

export default EditorPreviewModal
