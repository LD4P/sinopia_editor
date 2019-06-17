// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  removeAllItems, assignBaseURL, showGroupChooser, closeGroupChooser, showRdfPreview,
} from '../../actions/index'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import Config from '../../Config'
import { getCurrentSession, getCurrentUser } from '../../authSelectors'
import { publishRDFResource } from '../../sinopiaServer'
import { findNode } from '../../reducers/index'

const _ = require('lodash')

/**
 * This is the root component of the resource edit page
 */
class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resourceTemplateId: '',
    }
  }

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      this.setState({
        resourceTemplateId: this.props.location.state.resourceTemplateId,
      })
    } else {
      this.props.history.push('/templates')
    }
  }

  renderResourceTemplate = () => (
    <ResourceTemplate resourceTemplateId = {this.state.resourceTemplateId} />
  )

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

  // The ld4p group is only for templates
  groupsToSaveInto = () => Config.groupsInSinopia.filter(group => group[0] !== 'ld4p')

  render() {
    let authenticationMessage = <div className="alert alert-warning alert-dismissible">
      <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
      Alert! No data can be saved unless you are logged in with group permissions.
    </div>

    if (this.props.currentSession) {
      authenticationMessage = <span/>
    }

    let errorMessage

    if (this.props.displayValidations && this.props.errors.length > 0) {
      const errorList = this.props.errors.map(elem => (<li key={elem.path.join('-')}>{elem.label} {elem.message}</li>))

      errorMessage = <div className="row">
        <div className="col-md-12" style={{ marginTop: '10px' }}>
          <div className=" alert alert-danger alert-dismissible">
            <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
            There was a probem saving this resource. Validation errors: <ul>{errorList}</ul>
          </div>
        </div>
      </div>
    }

    return (
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        { authenticationMessage }
        <div className="row">
          <section className="col-md-3" style={{ float: 'right', width: '320px' }}>
            <button type="button" className="btn btn-link btn-sm btn-editor" onClick={ this.props.openRdfPreview }>Preview RDF</button>
            <button type="button" className="btn btn-primary btn-sm btn-editor" onClick={ this.props.openGroupChooser }>Save & Publish</button>
          </section>
        </div>
        <RDFModal save={ this.props.openGroupChooser } close={ this.props.closeRdfPreview } />
        {errorMessage}
        <div>
          <GroupChoiceModal close={ this.closeGroupChooser }
                            save={ this.chooseGroupThenSave }
                            groups={ this.groupsToSaveInto() } />
        </div>
        { _.isEmpty(this.state.resourceTemplateId) ? (<div>Loading resource template...</div>) : this.renderResourceTemplate() }
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
  currentSession: PropTypes.object,
  currentUser: PropTypes.object,
  errors: PropTypes.array,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = state => ({
  currentSession: getCurrentSession(state),
  currentUser: getCurrentUser(state),
  errors: findNode(state.selectorReducer, ['editor']).errors,
  displayValidations: state.selectorReducer.editor.displayValidations,
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
