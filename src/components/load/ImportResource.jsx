// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { existingResource as existingResourceCreator } from 'actionCreators'
import Header from '../Header'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'

class ImportResource extends Component {
  constructor(props) {
    super(props)
    this.state = { resourceN3: '', baseURI: '' }
    this.handleResourceN3Change = this.handleResourceN3Change.bind(this)
    this.handleBaseURIChange = this.handleBaseURIChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleResourceN3Change(event) {
    this.setState({ resourceN3: event.target.value })
  }

  handleBaseURIChange(event) {
    this.setState({ baseURI: event.target.value })
  }

  handleSubmit(event) {
    rdfDatasetFromN3(this.state.resourceN3).then((dataset) => {
      const builder = new ResourceStateBuilder(dataset, this.state.baseURI)
      const state = builder.state
      this.props.existingResource(state)
      this.props.history.push('/editor')
    })
    event.preventDefault()
  }

  render() {
    return (
      <div id="loadResource">
        <Header triggerEditorMenu={this.props.triggerHandleOffsetMenu}/>
        <form id="loadForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="resourceTextArea">Resource RDF N3</label>
            <textarea className="form-control" id="resourceTextArea" rows="15" value={this.state.resourceN3} onChange={this.handleResourceN3Change}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="uriInput">Base URI</label>
            <input type="text" className="form-control" id="uriInput" value={this.state.baseURI} onChange={this.handleBaseURIChange} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

ImportResource.propTypes = {
  existingResource: PropTypes.func,
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
  existingResource: (resource) => {
    dispatch(existingResourceCreator(resource))
  },
})

export default connect(null, mapDispatchToProps)(ImportResource)
