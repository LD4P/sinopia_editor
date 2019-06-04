// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { removeAllItems } from '../../actions/index'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import RDFModal from './RDFModal'
import GroupChoiceModal from './GroupChoiceModal'
import { getCurrentSession, getCurrentUser } from '../../authSelectors'
import { publishRDFResource } from '../../sinopiaServer'
import { getAllRdf } from '../../reducers/index'

const _ = require('lodash')

/**
 * This is the root component of the resource edit page
 */
class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tempRtState: true,
      resourceTemplateId: '',
      showRdf: false,
      showGroupChooser: false,
    }
  }

  componentDidMount() {
    if (this.state.tempRtState) {
      if (this.props.location.state !== undefined) {
        this.setState({
          resourceTemplateId: this.props.location.state.resourceTemplateId,
        })
      } else {
        this.props.history.push('/templates')
      }
      this.setState({ tempRtState: false })
    }
  }

  handleRdfShow = () => {
    this.setState({ showRdf: true })
  }

  handleRdfClose = () => {
    this.setState({ showRdf: false })
  }

  handleRdfSave = () => {
    this.setState({ showGroupChooser: true })
  }

  renderResourceTemplate = () => (
    <ResourceTemplate resourceTemplateId = {this.state.resourceTemplateId} />
  )

  chooseGroupThenSave = (rdf, group) => {
    publishRDFResource(this.props.currentUser, rdf, group)
    this.handleRdfClose()
    this.closeGroupChooser()
  }

  closeGroupChooser = () => {
    this.setState({ showGroupChooser: false })
  }

  render() {
    let authenticationMessage = <div className="alert alert-warning alert-dismissible">
      <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
      Alert! No data can be saved unless you are logged in with group permissions.
    </div>

    if (this.props.currentSession) {
      authenticationMessage = <span/>
    }

    return (
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        { authenticationMessage }
        <div className="row">
          <section className="col-md-3" style={{ float: 'right' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={ this.handleRdfShow }>Preview RDF</button>
          </section>
        </div>
        <div>
          <RDFModal show={ this.state.showRdf }
                    save={ () => this.handleRdfSave() }
                    close={ this.handleRdfClose }
                    rdf={ this.props.rdf } />
        </div>
        <div>
          <GroupChoiceModal show={ this.state.showGroupChooser }
                            rdf={this.props.rdf}
                            close={ this.closeGroupChooser }
                            save={ this.chooseGroupThenSave }/>
        </div>
        { _.isEmpty(this.state.resourceTemplateId) ? (<div>Loading resource template...</div>) : this.renderResourceTemplate() }
      </div>
    )
  }
}

Editor.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  resetStore: PropTypes.func,
  location: PropTypes.object,
  resourceTemplateId: PropTypes.string,
  history: PropTypes.object,
  currentSession: PropTypes.object,
  currentUser: PropTypes.object,
  rdf: PropTypes.object,
}

const mapStateToProps = (state, props) => ({
  currentSession: getCurrentSession(state),
  currentUser: getCurrentUser(state),
  rdf: getAllRdf(state, props),
})

const mapDispatchToProps = dispatch => ({
  resetStore() {
    dispatch(removeAllItems())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
