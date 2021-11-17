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
  hasValidationErrors as hasValidationErrorsSelector,
} from "selectors/errors"
import { selectCurrentResourceKey, selectResourceId } from "selectors/resources"
import { useHistory, useRouteMatch } from "react-router-dom"
import EditorPreviewModal from "./preview/EditorPreviewModal"
import { selectSubjectTemplateForSubject } from "selectors/templates"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"
import { resourceEditErrorKey } from "utilities/errorKeyFactory"

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
  const hasValidationErrors = useSelector((state) =>
    hasValidationErrorsSelector(state, resourceKey)
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
    <AlertsContextProvider value={resourceEditErrorKey(resourceKey)}>
      <div id="editor">
        <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
        <EditorPreviewModal />
        <ContextAlert />
        {displayErrors && hasValidationErrors && (
          <ErrorMessages resourceKey={resourceKey} />
        )}
        <GroupChoiceModal />
        <ResourcesNav />
        <EditorActions />
        <ResourceComponent />
      </div>
    </AlertsContextProvider>
  )
}

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  isMenuOpened: PropTypes.bool,
}

export default Editor
