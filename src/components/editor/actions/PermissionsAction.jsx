// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentResourceKey, selectUri } from "selectors/resources"
import { showModal as showModalAction } from "actions/modals"
import {
  displayResourceValidations,
  hasValidationErrors as hasValidationErrorsSelector,
} from "selectors/errors"

// Renders the permissions link for saved resource
const PermissionsAction = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const uri = useSelector((state) => selectUri(state, resourceKey))

  const hasValidationErrors = useSelector((state) =>
    hasValidationErrorsSelector(state, resourceKey)
  )
  const validationErrorsAreShowing = useSelector((state) =>
    displayResourceValidations(state, resourceKey)
  )

  const dispatch = useDispatch()
  const showGroupChooser = () => dispatch(showModalAction("GroupChoiceModal"))

  const handleClick = (event) => {
    showGroupChooser()
    event.preventDefault()
  }

  if (!uri) return null

  if (validationErrorsAreShowing && hasValidationErrors) return null

  return (
    <button
      type="button"
      className="btn btn-link float-end"
      onClick={handleClick}
    >
      Permissions
    </button>
  )
}

export default PermissionsAction
