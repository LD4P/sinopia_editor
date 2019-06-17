// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  removeAllItems, assignBaseURL, showGroupChooser, closeGroupChooser, showRdfPreview,
} from 'actions/index'
import ResourceTemplate from './ResourceTemplate'
import Header from '../Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import ErrorMessages from './ErrorMessages'
import AuthenticationMessage from './AuthenticationMessage'
import { getCurrentUser } from 'authSelectors'
import { publishRDFResource } from 'sinopiaServer'

/**
 * This is the root component of the resource edit page
 */
class Editor extends Component {
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/templates')
    }
  }

  chooseGroupThenSave = (rdf, group) => {
    const request = publishRDFResource(this.props.currentUser, rdf, group)

    request.then((result) => {
      this.props.setBaseURL(result.response.headers.location)
    }).catch((err) => {
      alert('Unable to save resource')
      console.error('unable to save resource')
      console.error(err)
    })
    this.props.closeRdfPreview()
    this.props.closeGroupChooser()
  }

  render() {
    return (
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <AuthenticationMessage />
        <div className="row">
          <section className="col-md-3" style={{ float: 'right', width: '320px' }}>
            <button type="button" className="btn btn-link btn-sm btn-editor" onClick={ this.props.openRdfPreview }>Preview RDF</button>
            <button type="button" className="btn btn-primary btn-sm btn-editor" onClick={ this.props.openGroupChooser }>Save & Publish</button>
          </section>
        </div>
        <RDFModal save={ this.props.openGroupChooser } close={ this.props.closeRdfPreview } />
        <ErrorMessages />
        <GroupChoiceModal close={ this.closeGroupChooser } save={ this.chooseGroupThenSave } />

        <ResourceTemplate resourceTemplateId = {this.props.location.state.resourceTemplateId} />
      </div>
    )
  }
}

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  resetStore: PropTypes.func,
  setBaseURL: PropTypes.func,
  openGroupChooser: PropTypes.func,
  closeGroupChooser: PropTypes.func,
  openRdfPreview: PropTypes.func,
  closeRdfPreview: PropTypes.func,
  location: PropTypes.object,
  resourceTemplateId: PropTypes.string,
  history: PropTypes.object,
  currentUser: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = dispatch => ({
  resetStore() {
    dispatch(removeAllItems())
  },
  setBaseURL(url) {
    dispatch(assignBaseURL(url))
  },
  openGroupChooser() {
    dispatch(showGroupChooser(true))
  },
  closeGroupChooser() {
    dispatch(closeGroupChooser(false))
  },
  openRdfPreview() {
    dispatch(showRdfPreview(true))
  },
  closeRdfPreview() {
    dispatch(showRdfPreview(false))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
