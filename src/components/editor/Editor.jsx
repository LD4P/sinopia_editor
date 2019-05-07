// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { removeAllItems, logIn } from '../../actions/index'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import RDFModal from './RDFModal'
import { loadState } from '../../localStorage'
const _ = require('lodash')

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tempRtState: true,
      userAuthenticated: false,
      resourceTemplateId: '',
      showRdf: false
    }
  }

  componentDidMount () {
    if (this.state.tempRtState) {
      if (this.props.location.state !== undefined) {
        this.setState({
          resourceTemplateId: this.props.location.state.resourceTemplateId
        })
      } else {
        this.props.history.push("/templates");
      }
      this.setState({tempRtState: false})
    }
  }

  handleRdfShow = () => {
    this.setState({showRdf: true})
  }

  // NOTE: it's possible these handle methods for RDFModal could live in RDFModal component
  handleRdfClose = () => {
    this.setState({showRdf: false})
  }

  renderResourceTemplate = () => (
    <ResourceTemplate resourceTemplateId = {this.state.resourceTemplateId} />
  )

  render() {

    let authenticationMessage = <div className="alert alert-warning alert-dismissible">
      <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
      Alert! No data can be saved unless you are logged in with group permissions.
      Log in <Link to={{pathname: "/login", state: { from: this.props.location }}} ><span className="alert-link" href="/login">here</span>.</Link>
    </div>;

    const user = loadState('jwtAuth')

    if (user !== undefined && user.isAuthenticated) {
      if (!this.state.userAuthenticated) {
        this.setState({userAuthenticated: true})
      }
    }

    if (this.state.userAuthenticated) {
      authenticationMessage = <span/>
    }

    return(
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        { authenticationMessage }
        <div className="row">
          <section className="col-md-3" style={{float: 'right'}}>
            <button type="button" className="btn btn-primary btn-sm" onClick={this.handleRdfShow}>Preview RDF</button>
          </section>
        </div>
        <div>
           <RDFModal show={this.state.showRdf}
                     close={this.handleRdfClose}/>
         </div>
          { _.isEmpty(this.state.resourceTemplateId) ? ( <div>Loading resource template...</div> ) : this.renderResourceTemplate() }
      </div>
    )
  }
}

Editor.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  resetStore: PropTypes.func,
  jwtAuth: PropTypes.object,
  location: PropTypes.object,
  resourceTemplateId: PropTypes.string,
  history: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  resetStore(){
    dispatch(removeAllItems())
  },
  authenticate(jwt){
    dispatch(logIn(jwt))
  }
})

export default connect(null, mapDispatchToProps)(Editor)
