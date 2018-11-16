// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import ResourceTemplate from './ResourceTemplate'
import EditorHeader from '../EditorHeader'
import StartingPoints from './StartingPoints'
const sinopiaServerSpoof = require('../../sinopiaServerSpoof.js')

class Editor extends Component {
  constructor(props) {
    super(props)

    this.getResourceTemplate = this.getResourceTemplate.bind(this)

    // TODO: temporarily hardcoded here.
    //  Selecting a resource template will happen in the left-nav "Starting Points" menu,
    //   another child of the Editor component;  it will call this.getResourceTemplate
    const defaultResourceTemplate = 'resourceTemplate:bf2:Monograph:Instance'
    this.state = { resourceTemplates: [this.getResourceTemplate(defaultResourceTemplate)]}
  }

  // TODO: eventually, this will do an http request to the sinopiaServer via fetch or axios
  //  Note that the spoofing uses sinopiaServerSpoof, which uses some files in static
  getResourceTemplate(rtId) {
    var rTemplate = {propertyTemplates : [{}] }
    if (rtId != null) {
      if (sinopiaServerSpoof.resourceTemplateIds.includes(rtId)) {
        // FIXME:  there's probably a better way to find the value in array than forEach
        sinopiaServerSpoof.resourceTemplateId2Json.forEach( function(el) {
          if (rtId == el.id) {
            rTemplate = el.json
          }
        })
      } else {
        console.error(`un-spoofed resourceTemplate: ${rtId}`)
      }
    } else {
      console.error(`asked for resourceTemplate with null id`)
    }
    return rTemplate
  }

  render() {
    return(
      <div id="editor">
        <EditorHeader triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <h1> Editor Page </h1>
        <p>The selected resource template is <strong>{this.state.resourceTemplates[0].id}</strong></p>
        <StartingPoints/>
        <ResourceTemplate resourceTemplates = {this.state.resourceTemplates ? this.state.resourceTemplates : []} />
      </div>
    )
  }
}

export default Editor
