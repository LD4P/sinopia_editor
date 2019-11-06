// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'
import useResource from 'hooks/useResource'
import { clearErrors, appendError } from 'actions/index'
import { showModal } from 'actions/modals'
import ResourceTemplateChoiceModal from '../ResourceTemplateChoiceModal'
import Alerts from '../Alerts'

import _ from 'lodash'

// Errors from retrieving a resource from this page.
export const loadResourceByRDFErrorKey = 'loadrdfresource'

const LoadByRDFForm = (props) => {
  const dispatch = useDispatch()

  const [baseURI, setBaseURI] = useState('')
  const [n3, setN3] = useState('')
  const [resourceN3, setResourceN3] = useState(false)
  const [resourceTemplateId, setResourceTemplateId] = useState('')
  useResource(resourceN3, baseURI, resourceTemplateId, loadResourceByRDFErrorKey, props.history)

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  useEffect(() => {
    // Clear resource template id so that useResource doesn't trigger with previous resource template id.
    setResourceTemplateId(null)
    // Clear errors
    if (resourceN3 === '') dispatch(clearErrors(loadResourceByRDFErrorKey))
  }, [dispatch, resourceN3])

  const changeN3 = (event) => {
    setN3(event.target.value)
    // This will get set on submit.
    setResourceN3(false)
    event.preventDefault()
  }

  const handleSubmit = (event) => {
    setResourceN3(false)
    dispatch(clearErrors(loadResourceByRDFErrorKey))
    // Try parsing to extract the resource template id
    rdfDatasetFromN3(n3).then((dataset) => {
      const builder = new ResourceStateBuilder(dataset, baseURI)
      // findRootResourceTemplateId() throws an error when resource template id not specified.
      // If it is not specified, then show the resource template chooser.
      try {
        setResourceTemplateId(builder.findRootResourceTemplateId())
      } catch (err) {
        dispatch(showModal('ResourceTemplateChoiceModal'))
      }
      setResourceN3(n3)
    }).catch((err) => {
      dispatch(appendError(loadResourceByRDFErrorKey, `Error parsing: ${err}`))
    })
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
      <Alerts errorKey={loadResourceByRDFErrorKey} />

      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourceTextArea">RDF</label>
          <textarea className="form-control" id="resourceTextArea" rows="15" value={n3}
                    onChange={event => changeN3(event)} placeholder={n3PlaceHolder}></textarea>
          <p className="help-block">Accepts Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3).</p>
        </div>
        <div className="form-group">
          <label htmlFor="uriInput">Base URI</label>
          <input type="url" className="form-control" id="uriInput" value={baseURI}
                 onChange={event => setBaseURI(event.target.value)}
                 placeholder={baseURIPlaceholder} />
          <p className="help-block">Omit brackets. If base URI is &lt;&gt;, leave blank.</p>
        </div>
        <button type="submit" disabled={ _.isEmpty(n3) } className="btn btn-primary">Submit</button>
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
