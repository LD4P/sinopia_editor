// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearResource } from 'actions/index'
import { currentResourceKey, resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'
import { useHistory } from 'react-router-dom'
import CloseResourceModal from './CloseResourceModal'
import { showModal } from 'actions/modals'

const CloseButton = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const resourceKey = useSelector(state => currentResourceKey(state))
  const resourceHasChanged = useSelector(state => resourceHasChangesSinceLastSave(state))

  const handleClick = (event) => {
    if (resourceHasChanged) {
      dispatch(showModal('CloseResourceModal'))
    } else {
      closeResource()
    }
    event.preventDefault()
  }

  const closeResource = () => {
    dispatch(clearResource(resourceKey))
    // In case this is /editor/<rtId>, clear
    history.push('/editor')
  }

  return (
    <React.Fragment>
      <CloseResourceModal closeResource={closeResource} />
      <button type="button"
              className="btn btn-secondary"
              aria-label="Close"
              title="Close"
              onClick={handleClick}>
        Close
      </button>
    </React.Fragment>
  )
}

export default CloseButton
