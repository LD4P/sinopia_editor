// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { showGroupChooser, showRdfPreview } from 'actions/index'
import { update } from 'actionCreators/resources'
import ResourceTemplate from './ResourceTemplate'
import Header from '../Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import ErrorMessages from './ErrorMessages'
import AuthenticationMessage from './AuthenticationMessage'
import { rootResourceId } from 'selectors/resourceSelectors'
import { getCurrentUser } from 'authSelectors'

/**
 * This is the root component of the resource edit page
 *   useEffect(() => {
 *   if (!props.location.state) {
 *     props.history.push('/templates')
 *   }
 * })
 *
 * const resourceTemplateId = props.location.state?.resourceTemplateId
 */
const Editor = props => (
  <div id="editor">
    <Header triggerEditorMenu={ props.triggerHandleOffsetMenu }/>
    <AuthenticationMessage />
    <div className="row">
      <section className="col-md-3" style={{ float: 'right', width: '320px' }}>
        <button type="button" className="btn btn-link btn-sm btn-editor" onClick={ props.openRdfPreview }>Preview RDF</button>
        <button type="button" className="btn btn-primary btn-sm btn-editor"
                onClick={ props.userWantsToSave(props.isSaved, props.currentUser) }>Save & Publish</button>
      </section>
    </div>
    <RDFModal save={ props.userWantsToSave(props.isSaved, props.currentUser) } />
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
}

const mapStateToProps = state => ({
  isSaved: !!rootResourceId(state),
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => ({
  userWantsToSave: (isSaved, user) => () => {
    if (isSaved) {
      dispatch(update(user))
    } else {
      dispatch(showGroupChooser(true))
    }
  },
  openRdfPreview: () => {
    dispatch(showRdfPreview(true))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
