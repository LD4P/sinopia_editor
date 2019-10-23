// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplate from './ResourceTemplate'
import Header from '../Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import CopyToNewButton from './CopyToNewButton'
import PreviewButton from './PreviewButton'
import SaveAndPublishButton from './SaveAndPublishButton'
import ErrorMessages from './ErrorMessages'
import AuthenticationMessage from './AuthenticationMessage'
import Alert from '../Alert'
import { resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'
import { Prompt } from 'react-router'

const Editor = (props) => {
  const [isPrompt, setPrompt] = useState(false)
  const saveError = useSelector(state => state.selectorReducer.editor.saveResourceError)
  const resourceKey = useSelector(state => state.selectorReducer.editor.currentResource)
  const resourceHasChanges = useSelector(state => resourceHasChangesSinceLastSave(state, resourceKey))

  useEffect(() => {
    setPrompt(resourceHasChanges && !props.isMenuOpened)
  }, [resourceHasChanges, props.isMenuOpened])


  // To handle prompt correctly with Chrome.
  const triggerHandleOffsetMenu = () => {
    setPrompt(false)
    props.triggerHandleOffsetMenu()
  }

  return (
    <div id="editor">
      <Prompt when={isPrompt} message="Resource has unsaved changes. Are you sure you want to leave?" />
      <Header triggerEditorMenu={ triggerHandleOffsetMenu }/>
      <AuthenticationMessage />
      <div className="row">
        <section className="col-md-3 offset-md-9 text-right">
          <CopyToNewButton />
          <PreviewButton />
          <SaveAndPublishButton id="editor-save" />
        </section>
      </div>
      <RDFModal />
      <ErrorMessages />
      <Alert text={saveError} />
      <GroupChoiceModal />
      <ResourceTemplate />
    </div>
  ) }

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  userWantsToSave: PropTypes.func,
  copyToNewResource: PropTypes.func,
  isSaved: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  isMenuOpened: PropTypes.bool,
}

export default Editor
