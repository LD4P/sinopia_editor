// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import ResourceTemplate from './ResourceTemplate'
import Header from './Header'
import StartingPoints from './StartingPoints'

class Editor extends Component {
  constructor(props) {
    super(props)

    // TODO: temporarily hardcoded here.
    //  Selecting a resource template will happen in the left-nav "Starting Points" menu,
    //   another child of the Editor component;  it will set state.resourceTemplateId
    // const defaultRtId = 'resourceTemplate:bf2:Monograph:Instance'
    const defaultRtId = 'resourceTemplate:bf2:Serial:Frequency'
    this.state = { resourceTemplateId: defaultRtId}
  }

  render() {
    return(
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <h1> Editor Page </h1>
        <p>The selected resource template is <strong>{this.state.resourceTemplateId}</strong></p>
        <StartingPoints/>
        <ResourceTemplate resourceTemplateId = {this.state.resourceTemplateId} />
      </div>
    )
  }
}

export default Editor
