// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import { useDispatch } from "react-redux"
import ModalWrapper from "components/ModalWrapper"
import PropTypes from "prop-types"
import { hideModal } from "actions/modals"
import InputTemplate from "./InputTemplate"

const ResourceTemplateChoiceModal = (props) => {
  const dispatch = useDispatch()

  const [selectedValue, setSelectedValue] = useState(undefined)

  const close = (event) => {
    event.preventDefault()
    dispatch(hideModal())
  }

  const saveAndClose = (event) => {
    event.preventDefault()
    props.choose(selectedValue)
    close(event)
  }

  const header = <h4 className="modal-title">Choose resource template</h4>

  const body = (
    <React.Fragment>
      <label htmlFor="template-lookup">
        Into which resource template do you want to load this resource?
      </label>
      <InputTemplate id="template-lookup" setTemplateId={setSelectedValue} />
    </React.Fragment>
  )

  const footer = (
    <React.Fragment>
      <button
        className="btn btn-link"
        style={{ paddingRight: "20px" }}
        onClick={close}
      >
        Cancel
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={(event) => saveAndClose(event)}
      >
        Save
      </button>
    </React.Fragment>
  )

  return (
    <ModalWrapper
      modalName="ResourceTemplateChoiceModal"
      ariaLabel="Choose resource template"
      header={header}
      body={body}
      footer={footer}
    />
  )
}

ResourceTemplateChoiceModal.propTypes = {
  choose: PropTypes.func.isRequired,
}

export default ResourceTemplateChoiceModal
