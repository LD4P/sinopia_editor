// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import PropTypes from "prop-types"
import { saveResource as saveResourceAction } from "actionCreators/resources"
import {
  resourceHasChangesSinceLastSave,
  selectPickSubject,
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
import useAlerts from "hooks/useAlerts"

const SaveAndPublishButton = (props) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()

  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  // selectPickSubject and shallowEqual prevents rerender from unrelated changed.
  const resource = useSelector(
    (state) =>
      selectPickSubject(state, resourceKey, ["group", "editGroups", "uri"]),
    shallowEqual
  )
  const resourceHasChanged = useSelector((state) =>
    resourceHasChangesSinceLastSave(state)
  )
  const hasValidationErrors = useSelector((state) =>
    hasValidationErrorsSelector(state, resourceKey)
  )
  const validationErrorsAreShowing = useSelector((state) =>
    displayResourceValidations(state, resourceKey)
  )

  const isSaved = !!resource.uri
  const isDisabled =
    !resourceHasChanged || (validationErrorsAreShowing && hasValidationErrors)

  const formIsValid = () => {
    if (hasValidationErrors) {
      dispatch(showValidationErrorsAction(resourceKey))
      return false
    }
    dispatch(hideValidationErrorsAction(resourceKey))
    return true
  }

  const handleClick = (event) => {
    event.preventDefault()
    if (formIsValid()) {
      if (isSaved) {
        dispatch(
          saveResourceAction(
            resourceKey,
            resource.group,
            resource.editGroups,
            errorKey
          )
        )
      } else {
        // Show group chooser
        dispatch(showModalAction("GroupChoiceModal"))
      }
    }
  }

  return (
    <button
      className={`btn btn-primary ${props.class}`}
      onClick={handleClick}
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
