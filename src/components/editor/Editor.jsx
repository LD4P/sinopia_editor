// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { useSelector, useDispatch } from "react-redux"
import ResourceComponent from "./ResourceComponent"
import Header from "../Header"
import RDFModal from "./RDFModal"
import GroupChoiceModal from "./GroupChoiceModal"
import EditorActions from "./EditorActions"
import ErrorMessages from "./ErrorMessages"
import ResourcesNav from "./ResourcesNav"
import {
  displayResourceValidations,
  hasValidationErrors,
} from "selectors/errors"
import { selectCurrentResourceKey } from "selectors/resources"
import { useParams, useHistory } from "react-router-dom"
import { newResource as newResourceCreator } from "actionCreators/resources"
import { newResourceErrorKey } from "../templates/SinopiaResourceTemplates"

// Error key for errors that occur while editing a resource.
export const resourceEditErrorKey = (resourceKey) =>
  `resourceedit-${resourceKey}`

const Editor = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { rtId } = useParams()

  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const displayErrors = useSelector((state) =>
    displayResourceValidations(state, resourceKey)
  )
  const hasErrors = useSelector((state) =>
    hasValidationErrors(state, resourceKey)
  )

  useEffect(() => {
    if (!resourceKey && rtId) {
      dispatch(newResourceCreator(rtId, newResourceErrorKey)).then((result) => {
        if (!result) history.push("/templates")
      })
    }
  }, [dispatch, rtId, resourceKey, history])

  if (!resourceKey) return null

  return (
    <div id="editor">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <EditorActions />
      <RDFModal />
      {displayErrors && hasErrors && <ErrorMessages />}
      <GroupChoiceModal />
      <ResourcesNav />
      <ResourceComponent />
      <EditorActions />
    </div>
  )
}

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  isMenuOpened: PropTypes.bool,
}

export default Editor
