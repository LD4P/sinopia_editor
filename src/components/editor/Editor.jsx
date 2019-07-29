// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { showRdfPreview } from 'actions/index'
import ResourceTemplate from './ResourceTemplate'
import Header from '../Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import SaveAndPublishButton from './SaveAndPublishButton'
import ErrorMessages from './ErrorMessages'
import AuthenticationMessage from './AuthenticationMessage'
import { resourceHasChangesSinceLastSave } from 'selectors/resourceSelectors'
import { Prompt } from 'react-router'

const Editor = props => (
  <div id="editor">
    <Prompt when={props.resourceHasChanges} message="Resource has unsaved changes. Are you sure you want to leave?" />
    <Header triggerEditorMenu={ props.triggerHandleOffsetMenu }/>
    <AuthenticationMessage />
    <div className="row">
      <section className="col-md-3" style={{ float: 'right', width: '320px' }}>
        <button type="button" className="btn btn-link btn-sm btn-editor" onClick={ props.openRdfPreview }>Preview RDF</button>
        <SaveAndPublishButton id="editor-save" />
      </section>
    </div>
    <RDFModal />
    <ErrorMessages />
    <GroupChoiceModal />

    <ResourceTemplate />
  </div>
)

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  userWantsToSave: PropTypes.func,
  openRdfPreview: PropTypes.func,
  isSaved: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  resourceHasChanges: PropTypes.bool,
}

const mapStateToProps = state => ({
  resourceHasChanges: resourceHasChangesSinceLastSave(state),
})


const mapDispatchToProps = dispatch => ({
  openRdfPreview: () => {
    dispatch(showRdfPreview(true))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
