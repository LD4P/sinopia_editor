// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { showGroupChooser, showRdfPreview } from 'actions/index'
import ResourceTemplate from './ResourceTemplate'
import Header from '../Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import ErrorMessages from './ErrorMessages'
import AuthenticationMessage from './AuthenticationMessage'

/**
 * This is the root component of the resource edit page
 */
const Editor = (props) => {
  useEffect(() => {
    if (!props.location.state) {
      props.history.push('/templates')
    }
  })

  const resourceTemplateId = props.location.state?.resourceTemplateId

  return (
    <div id="editor">
      <Header triggerEditorMenu={ props.triggerHandleOffsetMenu }/>
      <AuthenticationMessage />
      <div className="row">
        <section className="col-md-3" style={{ float: 'right', width: '320px' }}>
          <button type="button" className="btn btn-link btn-sm btn-editor" onClick={ props.openRdfPreview }>Preview RDF</button>
          <button type="button" className="btn btn-primary btn-sm btn-editor" onClick={ props.openGroupChooser }>Save & Publish</button>
        </section>
      </div>
      <RDFModal save={ props.openGroupChooser } />
      <ErrorMessages />
      <GroupChoiceModal />

      <ResourceTemplate resourceTemplateId={ resourceTemplateId } />
    </div>
  )
}

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  openGroupChooser: PropTypes.func,
  openRdfPreview: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
}

const mapStateToProps = () => ({ })


const mapDispatchToProps = dispatch => ({
  openGroupChooser() {
    dispatch(showGroupChooser(true))
  },
  openRdfPreview() {
    dispatch(showRdfPreview(true))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
