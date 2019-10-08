// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
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
import { resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'
import { Prompt } from 'react-router'

const Editor = (props) => {
  const [isPrompt, setPrompt] = useState(false)

  useEffect(() => {
    setPrompt(props.resourceHasChanges && !props.isMenuOpened)
  }, [props.resourceHasChanges, props.isMenuOpened])

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
        <section className="col-md-3 col-md-offset-9 text-right">
          <CopyToNewButton />
          <PreviewButton />
          <SaveAndPublishButton id="editor-save" />
        </section>
      </div>
      <RDFModal />
      <ErrorMessages />
      { props.saveError
        && <div className="row">
          <div className="col-md-12" style={{ marginTop: '10px' }}>
            <div className="alert alert-danger alert-dismissible">
              <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
              { props.saveError }
            </div>
          </div>
        </div>
      }
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
  resourceHasChanges: PropTypes.bool,
  isMenuOpened: PropTypes.bool,
  saveError: PropTypes.string,
}

const mapStateToProps = state => ({
  resourceHasChanges: resourceHasChangesSinceLastSave(state),
  saveError: state.selectorReducer.editor.saveResourceError,
})

export default connect(mapStateToProps)(Editor)
