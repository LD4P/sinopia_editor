// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { rootResourceId, resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'

const CopyToNewButton = (props) => {
  const dispatch = useDispatch()

  const copyResource = () => {
    alert('Copying to a new resource')
    // dispatch(copyResourceToEditor)  
  }

  return (
    <button type="button"
            className="btn btn-link btn-sm"
            onClick={() => copyResource()}
            disabled={ props.isDisabled }>Copy</button>
  )
}

CopyToNewButton.propTypes = {
  isDisabled: PropTypes.bool,
}

export default CopyToNewButton
