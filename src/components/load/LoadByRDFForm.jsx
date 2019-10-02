// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { existingResource } from 'actionCreators/resources'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'
import { getCurrentUser } from 'authSelectors'
import { rootResource } from 'selectors/resourceSelectors'
import _ from 'lodash'

const LoadByRDFForm = (props) => {
  // TODO: Use useResource hook. See https://github.com/LD4P/sinopia_editor/issues/1415
  const [baseUri, setBaseUri] = useState('')
  const [resourceN3, setResourceN3] = useState('')
  const [navigateEditor, setNavigateEditor] = useState(false)
  const [error, setError] = useState('')

  const handleBaseUriChange = event => setBaseUri(event.target.value)
  const handleResourceN3Change = event => setResourceN3(event.target.value)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && props.rootResource && !error) {
      props.history.push('/editor')
    }
  })

  const existingResource = () => rdfDatasetFromN3(resourceN3).then((dataset) => {
    const builder = new ResourceStateBuilder(dataset, baseUri)
    return builder.buildState().then((result) => {
      // TODO: This also returns the resource templates, which could be added to state.
      // See https://github.com/LD4P/sinopia_editor/issues/1396
      props.existingResource(result[0], result[1].toCanonical())
      return true
    }).catch(err => setError(err))
  }).catch(err => setError(`Error parsing: ${err}`))

  const handleSubmit = (event) => {
    setNavigateEditor(false)
    if (resourceN3 !== '') {
      setError('')
      existingResource().then((result) => {
        setNavigateEditor(result)
      })
    }
    event.preventDefault()
  }

  const n3PlaceHolder = `For example:
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "Tractatus Logico-Philosophicus"@en .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
  `

  const baseURIPlaceholder = 'For example: https://trellis.sinopia.io/repository/stanford/e111a712-5a45-4c2a-9201-289b98d7452e.'

  return (
    <div>
      <h4>Load RDF into Editor</h4>
      { error
        && <div className="row">
          <div className="col-md-12" style={{ marginTop: '10px' }}>
            <div className="alert alert-danger alert-dismissible">
              <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
              { error.toString() }
            </div>
          </div>
        </div>
      }
      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourceTextArea">N3 RDF</label>
          <textarea className="form-control" id="resourceTextArea" rows="15" value={resourceN3}
                    onChange={handleResourceN3Change} placeholder={n3PlaceHolder}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="uriInput">Base URI</label>
          <input type="url" className="form-control" id="uriInput" value={baseUri} onChange={handleBaseUriChange}
                 placeholder={baseURIPlaceholder} />
          <p className="help-block">Omit brackets. If base URI is &lt;&gt;, leave blank.</p>
        </div>
        <button type="submit" disabled={ _.isEmpty(resourceN3) } className="btn btn-primary">Submit</button>
        <p className="help-block">This will create a new resource that can be saved in Sinopia.</p>
      </form>
    </div>
  )
}

LoadByRDFForm.propTypes = {
  existingResource: PropTypes.func,
  setUnusedRDF: PropTypes.func,
  history: PropTypes.object,
  rootResource: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  rootResource: rootResource(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ existingResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoadByRDFForm)
