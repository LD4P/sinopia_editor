// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getCurrentUser } from 'authSelectors'
import { rootResourceId } from 'selectors/resourceSelectors'
import { copyNewResource, showCopyNewMessage } from 'actions/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const CopyToNewButton = (props) => {
  const dispatch = useDispatch()
  const resourceId = props.id || useSelector(state => rootResourceId(state))
  const currentUser = useSelector(state => getCurrentUser(state))

  const handleClick = () => {
    dispatch(copyNewResource(
      {
        currentUser,
        uri: resourceId,
      },
    ))
    dispatch(showCopyNewMessage(
      {
        oldUri: resourceId,
      },
    ))
  }

  return (
    <button type="button"
            className="btn btn-link"
            id={props.id}
            disabled={!resourceId}
            onClick={handleClick}
            title="Copy"
            aria-label="Copy this resource to a new resource">
      <FontAwesomeIcon icon={faCopy} size="2x" />
    </button>
  )
}

CopyToNewButton.propTypes = {
  copyResourceToEditor: PropTypes.func,
  id: PropTypes.string,
}

export default CopyToNewButton
