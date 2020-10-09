// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useEffect, useState,
} from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { newResourceErrorKey } from './SinopiaResourceTemplates'
import { newResource } from 'actionCreators/resources'
import { selectErrors } from 'selectors/errors'
import { selectCurrentResourceKey } from 'selectors/resources'
import _ from 'lodash'
import Config from 'Config'

const NewResourceTemplateButton = (props) => {
  const dispatch = useDispatch()

  const errors = useSelector((state) => selectErrors(state, newResourceErrorKey))
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && resourceKey && _.isEmpty(errors)) {
      props.history.push('/editor')
    }
  }, [navigateEditor, resourceKey, props.history, errors])


  const handleClick = (event) => {
    event.preventDefault()
    dispatch(newResource(Config.rootResourceTemplateId, newResourceErrorKey)).then((result) => {
      setNavigateEditor(result)
    })
  }
  return (
    <Link to={{ pathname: '/editor', state: { } }}
          onClick={(e) => handleClick(e)}>
      <button className="btn btn-primary" style={{ marginTop: '10px' }}>
        New template
      </button>
    </Link>
  )
}

NewResourceTemplateButton.propTypes = {
  history: PropTypes.object,
}

export default NewResourceTemplateButton
