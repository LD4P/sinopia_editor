// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { existingResource as existingResourceCreator } from 'actionCreators/resources'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'
import { rootResource as rootResourceSelector } from 'selectors/resourceSelectors'
import useResource from 'hooks/useResource'
import { showResourceTemplateChooser as showResourceTemplateChooserAction } from 'actions/index'
import ResourceTemplateChoiceModal from '../ResourceTemplateChoiceModal'
import Alert from '../Alert'
import _ from 'lodash'

const LoadByRDFForm = (props) => {
  const rootResource = useSelector(state => rootResourceSelector(state))

  const dispatch = useDispatch()
  const showResourceTemplateChooser = () => dispatch(showResourceTemplateChooserAction())

  const [baseURI, setBaseURI] = useState('')
  const [resourceN3, setResourceN3] = useState('')
  const [resourceTemplateId, setResourceTemplateId] = useState('')
  const [error, setError] = useState('')
  const [resourceState, unusedDataset, useResourceError] = useResource(resourceN3, baseURI, resourceTemplateId, rootResource, props.history)
  useEffect(() => {
    if (useResourceError && !error) {
      setError(useResourceError)
    }
  }, [useResourceError, error])

  useEffect(() => {
    if (resourceState && unusedDataset) {
      dispatch(existingResourceCreator(resourceState, unusedDataset.toCanonical()))
    }
  }, [dispatch, resourceState, unusedDataset])

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  useEffect(() => {
    // Clear resource template id so that useResource doesn't trigger with previous resource template id.
    setResourceTemplateId(null)
  }, [resourceN3])

  const handleSubmit = (event) => {
    // Try parsing to extract the resource template id
    rdfDatasetFromN3(resourceN3).then((dataset) => {
      const builder = new ResourceStateBuilder(dataset, baseURI)
      // findRootResourceTemplateId() throws an error when resource template id not specified.
      // If it is not specified, then show the resource template chooser.
      try {
        setResourceTemplateId(builder.findRootResourceTemplateId())
      } catch (err) {
        showResourceTemplateChooser()
      }
    }).catch(err => setError(`Error parsing: ${err}`))
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
      <Alert text={error?.toString()} />

      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourceTextArea">RDF</label>
          <textarea className="form-control" id="resourceTextArea" rows="15" value={resourceN3}
                    onChange={event => setResourceN3(event.target.value)} placeholder={n3PlaceHolder}></textarea>
          <p className="help-block">Accepts Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3).</p>
        </div>
        <div className="form-group">
          <label htmlFor="uriInput">Base URI</label>
          <input type="url" className="form-control" id="uriInput" value={baseURI}
                 onChange={event => setBaseURI(event.target.value)}
                 placeholder={baseURIPlaceholder} />
          <p className="help-block">Omit brackets. If base URI is &lt;&gt;, leave blank.</p>
        </div>
        <button type="submit" disabled={ _.isEmpty(resourceN3) } className="btn btn-primary">Submit</button>
        <p className="help-block">This will create a new resource that can be saved in Sinopia.</p>
      </form>
      <ResourceTemplateChoiceModal choose={chooseResourceTemplate} />
    </div>
  )
}

LoadByRDFForm.propTypes = {
  history: PropTypes.object.isRequired,
}

export default LoadByRDFForm
