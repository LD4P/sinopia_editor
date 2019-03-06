// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { removeAllItems, logIn } from '../../actions/index'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import StartingPoints from './StartingPoints'

class Editor extends Component {
  constructor(props) {
    super(props)

    // TODO: temporarily hardcoded here.
    //  Selecting a resource template will happen in the left-nav "Starting Points" menu,
    //   another child of the Editor component;  it will set state.resourceTemplateId
    const defaultRtId = 'resourceTemplate:bf2:Monograph:Instance'
    this.state = {
      resourceTemplateId: defaultRtId,
      tempRtState: true
    }
  }

  resetTempState = () => {
    this.setState({tempRtState: true})
  }

  //resource templates are set via StartingPoints and passed to ResourceTemplate
  setResourceTemplates = (content) => {
    this.props.resetStore()
    this.setState({resourceTemplateData: content})
  }

  render() {
    const user = this.props.jwtAuth

    let authenticationMessage = <div className="alert alert-warning alert-dismissible">
      <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
      Alert! No data can be saved unless you are logged in with group permissions.
      Log in <Link to={{pathname: "/login", state: { from: this.props.location }}} ><span className="alert-link" href="/login">here</span>.</Link>
    </div>;

    if (user !== undefined) {
      if (user.isAuthenticated) {
        authenticationMessage = ''
      }
    }

    return(
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        { authenticationMessage }
        <h1>[Clone|Edit] title.of.resource</h1>
        <StartingPoints
          tempStateCallback={this.resetTempState}
          resourceTemplatesCallback={this.setResourceTemplates}
          defaultRtId = {this.state.resourceTemplateId}
          setResourceTemplateCallback={this.setResourceTemplates}
        />
        <ResourceTemplate
          resourceTemplateId = {this.state.resourceTemplateId}
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
