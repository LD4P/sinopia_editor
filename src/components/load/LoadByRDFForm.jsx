// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { existingResource as existingResourceCreator } from 'actionCreators/resources'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'
import { getCurrentUser } from 'authSelectors'

const LoadByRDFForm = (props) => {
  const [baseUri, setBaseUri] = useState('')
  const [resourceN3, setResourceN3] = useState('')

  const handleBaseUriChange = event => setBaseUri(event.target.value)
  const handleResourceN3Change = event => setResourceN3(event.target.value)

  const handleSubmit = (event) => {
    if (resourceN3 !== '') {
      props.existingResource(resourceN3, baseUri)
    }
    event.preventDefault()
  }

  return (
    <div>
      <h4>Load RDF</h4>
      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourceTextArea">N3 RDF</label>
          <textarea className="form-control" id="resourceTextArea" rows="15" value={resourceN3} onChange={handleResourceN3Change}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="uriInput">Base URI</label>
          <input type="text" className="form-control" id="uriInput" value={baseUri} onChange={handleBaseUriChange} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

LoadByRDFForm.propTypes = {
  existingResource: PropTypes.func,
  history: PropTypes.object,
}

const mapDispatchToProps = (dispatch, props) => ({
  existingResource: (resourceN3, baseUri) => {
    rdfDatasetFromN3(resourceN3).then((dataset) => {
      const builder = new ResourceStateBuilder(dataset, baseUri)
      const resource = builder.state
      dispatch(existingResourceCreator(resource))
      props.history.push('/editor')
    })
  },
})

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})


export default connect(mapStateToProps, mapDispatchToProps)(LoadByRDFForm)
