// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { removeAllItems, logIn } from '../../actions/index'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import { loadState } from '../../localStorage'
const _ = require('lodash')

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tempRtState: true,
      userAuthenticated: false,
      resourceTemplateId: ''
    }

  }

  componentDidMount () {
    if (this.state.tempRtState) {
      if (this.props.location.state !== undefined) {
        this.setState({
          resourceTemplateId: this.props.location.state.resourceTemplateId
        })
      } else {
        this.setState({
          resourceTemplateId: this.props.resourceTemplateId
        })
      }
      this.setState({tempRtState: false})
    }
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
          <section className="col-md-9">
            <h3>Resource Template Label</h3>
            <h1>[Clone|Edit] <em>Name of Resource</em></h1>
          </section>
          <section className="col-md-3">
            <button type="button" className="btn btn-primary btn-sm">Preview RDF</button>
          </section>
        </div>
          { _.isEmpty(this.state.resourceTemplateId) ? ( <div>Loading resource template...</div> ) : this.renderResourceTemplate() }
      </div>
    )
  }
}

Editor.propTypes = {
  children: PropTypes.array,
  rtId: PropTypes.string,
  triggerHandleOffsetMenu: PropTypes.func,
  resetStore: PropTypes.func,
  jwtAuth: PropTypes.object,
  location: PropTypes.object,
  resourceTemplateId: PropTypes.string
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
