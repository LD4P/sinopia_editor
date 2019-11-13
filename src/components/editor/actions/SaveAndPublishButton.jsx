// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { update as updateCreator } from 'actionCreators/resources'
import {
  findResourceURI, resourceHasChangesSinceLastSave, findResourceValidationErrors,
  getDisplayResourceValidations, currentResourceKey,
} from 'selectors/resourceSelectors'
import { getCurrentUser } from 'authSelectors'
import {
  showGroupChooser as showGroupChooserAction,
  showValidationErrors as showValidationErrorsAction,
  hideValidationErrors as hideValidationErrorsAction,
} from 'actions/index'
import { resourceEditErrorKey } from '../Editor'

const SaveAndPublishButton = (props) => {
  const dispatch = useDispatch()

  const currentUser = useSelector(state => getCurrentUser(state))
  const resourceKey = useSelector(state => currentResourceKey(state))
  const update = () => dispatch(updateCreator(resourceKey, currentUser, resourceEditErrorKey(resourceKey)))

  const showGroupChooser = () => dispatch(showGroupChooserAction(resourceKey))
  const showValidationErrors = () => dispatch(showValidationErrorsAction(resourceKey))
  const hideValidationErrors = () => dispatch(hideValidationErrorsAction(resourceKey))

  const resourceHasChanged = useSelector(state => resourceHasChangesSinceLastSave(state))
  const isSaved = useSelector(state => !!findResourceURI(state))
  const hasValidationErrors = useSelector(state => findResourceValidationErrors(state).length > 0)
  const validationErrorsAreShowing = useSelector(state => getDisplayResourceValidations(state))
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
        update()
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
