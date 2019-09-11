// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { existingResource } from 'actionCreators/resources'
import { setUnusedRDF } from 'actions/index'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3, rdfDatasetFromJsonLD } from 'Utilities'
import { getCurrentUser } from 'authSelectors'
import { rootResource } from 'selectors/resourceSelectors'

const LoadByRDFForm = (props) => {
  const [baseUri, setBaseUri] = useState('')
  const [resource, setResource] = useState('')
  const [navigateEditor, setNavigateEditor] = useState(false)
  const [resourceType, setResourceType] = useState('n3')
  const [resourceTemplateId, setResourceTemplateId] = useState('')
  const [retrieveURL, setRetrieveURL] = useState('')

  const handleBaseUriChange = event => setBaseUri(event.target.value)
  const handleResourceChange = event => setResource(event.target.value)
  const handleResourceTypeChange = event => setResourceType(event.target.value)
  const handleResourceTemplateIdChange = event => setResourceTemplateId(event.target.value)
  const handleRetrieveURLChange = event => setRetrieveURL(event.target.value)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && props.rootResource) {
      props.history.push('/editor')
    }
  })

  const existingResource = () => {
    const parser = resourceType === 'jsonld' ? rdfDatasetFromJsonLD : rdfDatasetFromN3
    parser(resource).then((dataset) => {
      const builder = new ResourceStateBuilder(dataset, baseUri, resourceTemplateId)
      builder.generateState().then((result) => {
        props.setUnusedRDF(result[1].toCanonical())
        props.existingResource(result[0])
      })
    })
  }

  const handleSubmit = (event) => {
    if (resource !== '') {
      existingResource()
      setNavigateEditor(true)
    }
    event.preventDefault()
  }

  const handleRetrieve = (event) => {
    // TODO: Handle Error
    if (retrieveURL !== '') {
      fetch(retrieveURL)
        .then(resp => resp.text())
        .then(text => setResource(text))
        .catch(error => console.error(error))
      setRetrieveURL('')
    }
    event.preventDefault()
  }

  const rtOptions = [
    <option key='0' value=''>Use resource template specified in RDF</option>
  ]
  props.resourceTemplateSummaries.sort((a, b) => {
    if(a.name < b.name) { return -1 }
    if(a.name > b.name) { return 1 }
    return 0
  }).forEach((summary) => {
    rtOptions.push(<option key={summary.id} value={summary.id}>{summary.name} ({summary.id})</option>)
  })

  return (
    <div>
      <h4>Load RDF</h4>
      <form id="retrieveRDFForm" className="form-inline" onSubmit={handleRetrieve}>
        <input type="text" className="form-control" placeholder="URL" value={retrieveURL} onChange={handleRetrieveURLChange} />
        <button type="submit" className="btn btn-default">Retrieve RDF</button>
      </form>
      <br />
      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourceTextArea">RDF</label>
          <textarea className="form-control" id="resourceTextArea" rows="15" value={resource} onChange={handleResourceChange}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="uriInput">Base URI</label>
          <input type="text" className="form-control" id="uriInput" value={baseUri} onChange={handleBaseUriChange} />
        </div>
        <div className="form-group">
          <label htmlFor="resourceTypeSelect">Resource type</label>
          <select className="form-control" id="resourceTypeSelect" value={resourceType} onChange={handleResourceTypeChange}>
            <option value='n3'>N3</option>
            <option value='jsonld'>JSONLD</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="resourceTemplateSelect">Resource template</label>
          <select className="form-control" id="resourceTemplateSelect" value={resourceTemplateId} onChange={handleResourceTemplateIdChange}>
            {rtOptions}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

LoadByRDFForm.propTypes = {
  existingResource: PropTypes.func,
  history: PropTypes.object,
  rootResource: PropTypes.object,
  resourceTemplateSummaries: PropTypes.array,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  rootResource: rootResource(state),
  resourceTemplateSummaries: Object.values(state.selectorReducer.entities.resourceTemplateSummaries),
})

const mapDispatchToProps = dispatch => bindActionCreators({ existingResource, setUnusedRDF }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoadByRDFForm)
