// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
import { setCurrentResource } from 'actions/index'

const Editor = (props) => {
  const [isPrompt, setPrompt] = useState(false)
  const saveError = useSelector(state => state.selectorReducer.editor.saveResourceError)
  const resourceKey = useSelector(state => state.selectorReducer.editor.currentResource)
  const resourceHasChanges = useSelector(state => resourceHasChangesSinceLastSave(state, resourceKey))
  const dispatch = useDispatch()


  useEffect(() => {
    setPrompt(resourceHasChanges && !props.isMenuOpened)
  }, [resourceHasChanges, props.isMenuOpened])


  // To handle prompt correctly with Chrome.
  const triggerHandleOffsetMenu = () => {
    setPrompt(false)
    props.triggerHandleOffsetMenu()
  }

  const resourceKeys = useSelector(state => Object.keys(state.selectorReducer.resources))
  const currentResourceKey = useSelector(state =>state.selectorReducer.editor.currentResource)
  const createResourceTemplateNavItem = (resourceKey, idx, active) => {
    const classes = ['nav-link']
    if (active) classes.push('active')
    return (
      <li className="nav-item" key={resourceKey}>
        <a className={classes.join(' ')}
          href="#"
          onClick={(event) => handleResourceNavClick(event, resourceKey)}>Resource {idx+1}</a>
      </li>
    )
  }
  const resourceTemplateNavItems = resourceKeys.length > 1 ? resourceKeys.map((resourceKey, idx) => {
    return createResourceTemplateNavItem(resourceKey, idx, resourceKey === currentResourceKey)
  }) : []

  const handleResourceNavClick = (event, resourceKey) => {
    event.preventDefault()
    dispatch(setCurrentResource(resourceKey))
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
      <div className="row">
        <ul className="nav nav-pills">
          { resourceTemplateNavItems }
        </ul>
      </div>
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
