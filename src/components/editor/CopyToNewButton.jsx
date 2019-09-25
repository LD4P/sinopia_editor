// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getCurrentUser } from 'authSelectors'
import { rootResourceId } from 'selectors/resourceSelectors'
import { copyNewResource, showCopyNewMessage } from 'actions/index'

const CopyToNewButton = (props) => {
  const dispatch = useDispatch()
  const resourceId = useSelector(state => rootResourceId(state))
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
        show: true,
        oldUri: resourceId,
      },
    ))
  }

  return (
    <button type="button"
            className="btn btn-link btn-sm"
            id={props.id}
            disabled={resourceId === undefined}
            onClick={() => handleClick()}>Copy</button>
  )
}

CopyToNewButton.propTypes = {
  copyResourceToEditor: PropTypes.func,
  id: PropTypes.string,
}

export default CopyToNewButton
