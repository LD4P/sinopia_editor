// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')
import PropTypes from 'prop-types'
import Header from './Header'
import StartingPoints from './StartingPoints'

class ImportResourceTemplate extends Component {
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

  componentDidUpdate(nextProps){
    if (nextProps.location.state) {

      if(this.state.tempRtState){
        const rtId = nextProps.location.state.rtId
        const data = getResourceTemplate(rtId)
        if (!this.state.resourceTemplateId) {
          this.setState({resourceTemplateId: rtId})
        }
        this.setResourceTemplates(JSON.stringify(data))
      }
    }
  }

  resetTempState = () => {
    this.setState({tempRtState: true})
  }

  //resource templates are set via StartingPoints and passed to ResourceTemplate
  setResourceTemplates = (content) => {
    this.setState({tempRtState: false})
    this.setState({resourceTemplateData: content})
  }

  render() {
    return(
      <div id="editor">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <StartingPoints
          tempStateCallback={this.resetTempState}
          resourceTemplatesCallback={this.setResourceTemplates}
          resourceTemplateId = {this.state.resourceTemplateId}
          setResourceTemplateCallback={this.setResourceTemplates}
        />
       
      </div>
    )
  }
}

ImportResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func
}



export default (ImportResourceTemplate)
