// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { saveResource as saveResourceAction } from 'actionCreators/resources'
import {
  resourceHasChangesSinceLastSave, selectCurrentResource,
} from 'selectors/resources'
import {
  displayResourceValidations, selectCurrentResourceValidationErrors,
} from 'selectors/errors'
import {
  showGroupChooser as showGroupChooserAction,
} from 'actions/modals'
import {
  showValidationErrors as showValidationErrorsAction,
  hideValidationErrors as hideValidationErrorsAction,
} from 'actions/errors'
import { resourceEditErrorKey } from '../Editor'

const SaveAndPublishButton = (props) => {
  const dispatch = useDispatch()

  const resource = useSelector((state) => selectCurrentResource(state))
  const isSaved = !!resource.uri
  const saveResource = () => dispatch(saveResourceAction(resource.key, resourceEditErrorKey(resource.key)))

  const showGroupChooser = () => dispatch(showGroupChooserAction(resource.key))
  const showValidationErrors = () => dispatch(showValidationErrorsAction(resource.key))
  const hideValidationErrors = () => dispatch(hideValidationErrorsAction(resource.key))

  const resourceHasChanged = useSelector((state) => resourceHasChangesSinceLastSave(state))
  const hasValidationErrors = useSelector((state) => selectCurrentResourceValidationErrors(state).length > 0)
  const validationErrorsAreShowing = useSelector((state) => displayResourceValidations(state))
  const [isDisabled, setIsDisabled] = useState(true)

  useEffect(() => {
    // Disabled if resource has not changed or resource has changed but isSaved and there are validation errors.
    setIsDisabled(!resourceHasChanged || (validationErrorsAreShowing && hasValidationErrors))
  }, [resourceHasChanged, validationErrorsAreShowing, hasValidationErrors])

  const save = () => {
    // Close RDF modal if open
    if (hasValidationErrors) {
      showValidationErrors()
    }
    else {
      hideValidationErrors()
      if (isSaved) {
        saveResource()
      } else {
        showGroupChooser()
      }
    }
  }

  return (
    <button className={ `btn btn-primary ${props.class}` } onClick={ save } aria-label="Save" disabled={ isDisabled }>
      Save
    </button>
  )
}

SaveAndPublishButton.propTypes = {
  class: PropTypes.string,
}

export default SaveAndPublishButton
