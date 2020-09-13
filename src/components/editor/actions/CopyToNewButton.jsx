// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { showCopyNewMessage } from 'actions/messages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { selectCurrentResource } from 'selectors/resources'
import { newResourceCopy } from 'actionCreators/resources'

const CopyToNewButton = (props) => {
  const dispatch = useDispatch()
  const resource = useSelector((state) => selectCurrentResource(state))

  const handleClick = () => {
    dispatch(newResourceCopy(resource.key))
    dispatch(showCopyNewMessage(resource.uri))
  }

  return (
    <button type="button"
            className="btn btn-link"
            id={props.id}
            disabled={!resource.uri}
            onClick={handleClick}
            title="Copy"
            data-testid="Copy this resource to a new resource"
            aria-label="Copy this resource to a new resource">
      <FontAwesomeIcon icon={faCopy} className="icon-lg" />
    </button>
  )
}

CopyToNewButton.propTypes = {
  copyResourceToEditor: PropTypes.func,
  id: PropTypes.string,
}

export default CopyToNewButton
