// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import {
  resourceHasChangesSinceLastSave,
  selectCurrentResourceKey,
} from "selectors/resources"
import CloseResourceModal from "./CloseResourceModal"
import { showModal } from "actions/modals"
import useEditor from "hooks/useEditor"

const CloseButton = (props) => {
  const dispatch = useDispatch()

  let resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  if (props.resourceKey) {
    resourceKey = props.resourceKey
  }
  const { handleCloseResource } = useEditor(resourceKey)

  const resourceHasChanged = useSelector((state) =>
    resourceHasChangesSinceLastSave(state, resourceKey)
  )

  const handleClick = (event) => {
    if (resourceHasChanged) {
      dispatch(showModal(`CloseResourceModal-${resourceKey}`))
    } else {
      handleCloseResource()
    }
    event.preventDefault()
  }
  let btnClass = props.css || "btn-secondary"
  // kludge to space circles between editor actions
  if (btnClass === "editor-action-close") {
    btnClass = "btn-secondary editor-action-close"
  }
  const buttonLabel = props.label
  const buttonClasses = `btn ${btnClass}`

  return (
    <React.Fragment>
      <CloseResourceModal resourceKey={resourceKey} />
      <button
        type="button"
        className={buttonClasses}
        aria-label="Close"
        title="Close"
        onClick={handleClick}
      >
        {buttonLabel}
      </button>
    </React.Fragment>
  )
}

CloseButton.propTypes = {
  css: PropTypes.string,
  label: PropTypes.string,
  resourceKey: PropTypes.string,
}

export default CloseButton
