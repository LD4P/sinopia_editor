// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import ResourceComponent from "./ResourceComponent"
import Header from "../Header"
import GroupChoiceModal from "./GroupChoiceModal"
import EditorActions from "./EditorActions"
import ErrorMessages from "./ErrorMessages"
import ResourcesNav from "./ResourcesNav"
import {
  displayResourceValidations,
  hasValidationErrors,
} from "selectors/errors"
import { selectCurrentResourceKey, selectResourceId } from "selectors/resources"
import { useHistory, useRouteMatch } from "react-router-dom"
import EditorPreviewModal from "./preview/EditorPreviewModal"
import { selectSubjectTemplateForSubject } from "selectors/templates"

// Error key for errors that occur while editing a resource.
export const resourceEditErrorKey = (resourceKey) =>
  `resourceedit-${resourceKey}`

// Error key for warnings that occur while editing a resource.
export const resourceEditWarningKey = (resourceKey) =>
  `resourceedit-warning-${resourceKey}`

const Editor = (props) => {
  const history = useHistory()
  const editorTemplateMatch = useRouteMatch({
    path: "/editor/:templateId",
    exact: true,
  })
  const editorResourceMatch = useRouteMatch("/editor/resource/:resourceId")

  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  // Resource ID is extracted from the URI. Presence indicates the resource has been saved.
  const resourceId = useSelector((state) =>
    selectResourceId(state, resourceKey)
  )
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplateForSubject(state, resourceKey)
  )
  const subjectTemplateKey = subjectTemplate?.key

  const displayErrors = useSelector((state) =>
    displayResourceValidations(state, resourceKey)
  )
  const hasErrors = useSelector((state) =>
    hasValidationErrors(state, resourceKey)
  )

  useEffect(() => {
    if (!resourceKey) return
    // If resource has been saved.
    if (resourceId) {
      if (
        !editorResourceMatch ||
        editorResourceMatch.params.resourceId !== resourceId
      ) {
        history.replace(`/editor/resource/${resourceId}`)
      }
    } else if (
      !editorTemplateMatch ||
      editorTemplateMatch.params.templateId !== subjectTemplateKey
    ) {
      history.replace(`/editor/${subjectTemplateKey}`)
    }
  }, [
    resourceKey,
    editorTemplateMatch,
    editorResourceMatch,
    subjectTemplateKey,
    resourceId,
    history,
  ])

  if (!resourceKey) return <div id="editor">Loading ...</div>

  return (
    <div id="editor">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <EditorPreviewModal />
      {displayErrors && hasErrors && (
        <ErrorMessages resourceKey={resourceKey} />
      )}
      <GroupChoiceModal />
      <ResourcesNav />
      <EditorActions />
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
