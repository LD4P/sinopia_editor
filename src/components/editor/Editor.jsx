// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { showRdfPreview } from 'actions/index'
import ResourceTemplate from './ResourceTemplate'
import Header from '../Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import CopyToNewButton from './CopyToNewButton'
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
        <section className="col-md-3" style={{ float: 'right', width: '320px' }}>
          <CopyToNewButton />
          <button type="button" className="btn btn-link btn-sm btn-editor" onClick={ () => props.showRdfPreview(true) }>Preview RDF</button>
          <SaveAndPublishButton id="editor-save" />
        </section>
      </div>
      <RDFModal />
      <ErrorMessages />
      <GroupChoiceModal />
      <ResourceTemplate />
    </div>
  ) }

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  userWantsToSave: PropTypes.func,
  copyToNewResource: PropTypes.func,
  showRdfPreview: PropTypes.func,
  isSaved: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  resourceHasChanges: PropTypes.bool,
  isMenuOpened: PropTypes.bool,
}

const mapStateToProps = state => ({
  resourceHasChanges: resourceHasChangesSinceLastSave(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ showRdfPreview }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
