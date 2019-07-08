// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { existingResource as existingResourceCreator } from 'actionCreators'
import Header from './Header'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'
const _ = require('lodash')

class ResourceInput extends Component {
  constructor(props) {
    super(props)
    this.state = {resourceN3: '', baseURI: ''}
    this.handleResourceN3Change = this.handleResourceN3Change.bind(this)
    this.handleBaseURIChange = this.handleBaseURIChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleResourceN3Change(event) {
    this.setState({resourceN3: event.target.value})
  }

  handleBaseURIChange(event) {
    this.setState({baseURI: event.target.value})
  }

  handleSubmit(event) {
    console.log('n3', this.state.resourceN3)
    rdfDatasetFromN3(this.state.resourceN3).then((dataset) =>{
      const builder = new ResourceStateBuilder(dataset, this.state.baseURI)
      this.props.existingResource(builder.state)
    })
    console.log('history', this.props.history)
    this.props.history.push('/editor')
    event.preventDefault()
  }

  render() {
    return (
      <div id="loadResource">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <form onSubmit={this.handleSubmit}>
        Resource RDF N3:<br />
        <textarea rows="10" cols="100" value={this.state.resourceN3} onChange={this.handleResourceN3Change} /><br />
        Base URI:<br />
        <input type="text" size="50" value={this.state.baseURI} onChange={this.handleBaseURIChange}/>
        <br />
        <input type="submit" value="Submit" />
      </form>
      </div>
    )
  }
}

ResourceInput.propTypes = {
  existingResource: PropTypes.func,
  triggerHandleOffsetMenu: PropTypes.func,
}

const mapDispatchToProps = dispatch => ({
  existingResource: (resource) => {
    dispatch(existingResourceCreator(resource))
  },
})

export default connect(null, mapDispatchToProps)(ResourceInput)
