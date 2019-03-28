// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import Header from './Header'
import ImportFileZone from './ImportFileZone'
import SinopiaResourceTemplates from './SinopiaResourceTemplates'

class ImportResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  componentDidUpdate(){
    if(!this.state.redirect) {
      this.setState({redirect: true})
    }
  }

  //resource templates are set via ImportFileZone and passed to ResourceTemplate via redirect to Editor
  setResourceTemplates = (content) => {
    this.setState({resourceTemplateData: content})
  }

  render() {
    if (!this.state.redirect) {
      return(
        <div id="importResourceTemplate">
          <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
          <ImportFileZone setResourceTemplateCallback={this.setResourceTemplates} />
          <SinopiaResourceTemplates />
        </div>
      )
    } else {
      return <Redirect to={{pathname: '/editor', state: { resourceTemplateData: this.state.resourceTemplateData }}} />
    }
  }
}

ImportResourceTemplate.propTypes = {
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func
}

export default (ImportResourceTemplate)
