// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { saveResource as saveResourceAction } from "actionCreators/resources"
import {
  resourceHasChangesSinceLastSave,
  selectNormSubject,
  selectCurrentResourceKey,
} from "selectors/resources"
import {
  displayResourceValidations,
  hasValidationErrors as hasValidationErrorsSelector,
} from "selectors/errors"
import { showModal as showModalAction } from "actions/modals"
import {
  showValidationErrors as showValidationErrorsAction,
  hideValidationErrors as hideValidationErrorsAction,
} from "actions/errors"
import { resourceEditWarningKey } from "../Editor"

const SaveAndPublishButton = (props) => {
  const dispatch = useDispatch()

  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const isSaved = !!resource.uri
  const saveResource = () =>
    dispatch(
      saveResourceAction(
        resourceKey,
        resource.group,
        resource.editGroups,
        resourceEditWarningKey(resourceKey)
      )
    )

  const showGroupChooser = () => dispatch(showModalAction("GroupChoiceModal"))
  const showValidationErrors = () =>
    dispatch(showValidationErrorsAction(resourceKey))
  const hideValidationErrors = () =>
    dispatch(hideValidationErrorsAction(resourceKey))

  const resourceHasChanged = useSelector((state) =>
    resourceHasChangesSinceLastSave(state)
  )
  const hasValidationErrors = useSelector((state) =>
    hasValidationErrorsSelector(state, resourceKey)
  )
  const validationErrorsAreShowing = useSelector((state) =>
    displayResourceValidations(state, resourceKey)
  )
  const [isDisabled, setIsDisabled] = useState(true)

  useEffect(() => {
    // Disabled if resource has not changed or resource has changed but isSaved and there are validation errors.
    setIsDisabled(
      !resourceHasChanged || (validationErrorsAreShowing && hasValidationErrors)
    )
  }, [resourceHasChanged, validationErrorsAreShowing, hasValidationErrors])

  const save = () => {
    if (formIsValid()) {
      if (isSaved) {
        saveResource()
      } else {
        showGroupChooser()
      }
    }
  }

  const formIsValid = () => {
    if (hasValidationErrors) {
      showValidationErrors()
      return false
    }
    hideValidationErrors()
    return true
  }

  return (
    <button
      className={`btn btn-primary ${props.class}`}
      onClick={save}
      aria-label="Save"
      disabled={isDisabled}
    >
      Save
    </button>
  )
}

SaveAndPublishButton.propTypes = {
  class: PropTypes.string,
}

export default SaveAndPublishButton
