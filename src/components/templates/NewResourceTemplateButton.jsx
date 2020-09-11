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
import { selectCurrentResource } from 'selectors/resources'
import _ from 'lodash'

const NewResourceTemplateButton = (props) => {
  const dispatch = useDispatch()

  const errors = useSelector((state) => selectErrors(state, newResourceErrorKey))
  const resource = useSelector((state) => selectCurrentResource(state))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && resource && _.isEmpty(errors)) {
      props.history.push('/editor')
    }
  }, [navigateEditor, resource, props.history, errors])


  const handleClick = (event) => {
    event.preventDefault()
    dispatch(newResource('sinopia:template:resource', newResourceErrorKey)).then((result) => {
      setNavigateEditor(result)
    })
  }
  return (
    <Link to={{ pathname: '/editor', state: { } }} onClick={(e) => handleClick(e)}>+ New template</Link>
  )
}

NewResourceTemplateButton.propTypes = {
  history: PropTypes.object,
}

export default NewResourceTemplateButton
