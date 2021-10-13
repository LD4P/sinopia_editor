// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { showModal } from "actions/modals"

const PreviewButton = () => {
  const dispatch = useDispatch()

  const handleClick = (event) => {
    dispatch(showModal("RDFModal"))
    event.preventDefault()
  }

  return (
    <button
      type="button"
      className="btn btn-link"
      aria-label="Preview resource"
      title="Preview resource"
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faEye} className="icon-lg" />
    </button>
  )
}

export default PreviewButton
