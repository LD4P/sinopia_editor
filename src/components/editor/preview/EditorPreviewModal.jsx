// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import { isCurrentModal } from "selectors/modals"
import ModalWrapper from "../../ModalWrapper"
import SaveAndPublishButton from "../actions/SaveAndPublishButton"
import ResourceDisplay from "./ResourceDisplay"
import { selectCurrentResourceKey } from "selectors/resources"

const EditorPreviewModal = () => {
  const show = useSelector((state) => isCurrentModal(state, "RDFModal"))
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))

  const header = <h4 className="modal-title">Preview</h4>

  const body = show ? (
    <ResourceDisplay
      resourceKey={resourceKey}
      defaultFormat="table"
      displayRelationships={false}
    />
  ) : null

  const footer = <SaveAndPublishButton class="modal-save" />

  return (
    <ModalWrapper
      modalName="RDFModal"
      header={header}
      body={body}
      footer={footer}
      data-testid="rdf-modal"
      ariaLabel="Preview"
      size="lg"
    />
  )
}

export default EditorPreviewModal
