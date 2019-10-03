// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useDispatch } from 'react-redux'
import { showRdfPreview } from 'actions/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

const PreviewButton = () => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(showRdfPreview(true))
  }

  return (
    <button type="button" className="btn btn-link"
            aria-label="Preview RDF" title="Preview RDF" onClick={ handleClick }>
      <FontAwesomeIcon icon={faEye} size="2x" />
    </button>
  )
}

export default PreviewButton
