// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { removeAllItems, logIn } from '../../actions/index'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import { loadState } from '../../localStorage'

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tempRtState: true,
      userAuthenticated: false
    }
  }

  render() {
    let authenticationMessage = <div className="alert alert-warning alert-dismissible">
      <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
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

    if (this.props.location.state !== undefined && this.state.tempRtState) {
      this.setState({
        resourceTemplateData: this.props.location.state.resourceTemplateData,
        tempRtState: false
      })
    }

    return(
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        { authenticationMessage }
        <h1>[Clone|Edit] title.of.resource</h1>
        <ResourceTemplate
          resourceTemplateId = {this.props.resourceTemplateId}
          resourceTemplateData = {this.state.resourceTemplateData}
        />
      </div>
    )
  }
}

Editor.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func,
  resetStore: PropTypes.func,
  jwtAuth: PropTypes.object,
  location: PropTypes.object
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
