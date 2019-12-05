// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import ResourceTemplate from './ResourceTemplate'
import Header from '../Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import EditorActions from './EditorActions'
import ErrorMessages from './ErrorMessages'
import ResourcesNav from './ResourcesNav'
import AuthenticationMessage from './AuthenticationMessage'

// Error key for errors that occur while editing a resource.
export const resourceEditErrorKey = (resourceKey) => `resourceedit-${resourceKey}`

const Editor = (props) => (
  <div id="editor">
    <Header triggerEditorMenu={ props.triggerHandleOffsetMenu }/>
    <AuthenticationMessage />
    <EditorActions />
    <RDFModal />
    <ErrorMessages />
    <GroupChoiceModal />
    <ResourcesNav />
    <ResourceTemplate />
    <EditorActions />
  </div>
)

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  isMenuOpened: PropTypes.bool,
}

export default Editor
