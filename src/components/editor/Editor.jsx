// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import StartingPoints from './StartingPoints'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')

class Editor extends Component {
  constructor(props) {
    super(props)

    // TODO: temporarily hardcoded here.
    //  Selecting a resource template will happen in the left-nav "Starting Points" menu,
    //   another child of the Editor component;  it will set state.resourceTemplates
    const defaultResourceTemplate = 'resourceTemplate:bf2:Monograph:Instance'
    this.state = { resourceTemplates: [getResourceTemplate(defaultResourceTemplate)]}
  }

  render() {
    return(
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <h1> Editor Page </h1>
        <p>The selected resource template is <strong>{this.state.resourceTemplates[0].id}</strong></p>
        <StartingPoints/>
        <ResourceTemplate resourceTemplates = {this.state.resourceTemplates ? this.state.resourceTemplates : []} />
      </div>
    )
  }
}

export default Editor
