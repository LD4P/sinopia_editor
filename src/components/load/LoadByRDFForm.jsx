// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import {
  datasetFromRdf, findRootResourceTemplateId, hasQuadsForRootResourceTemplateId,
} from 'utilities/Utilities'
import useResource from 'hooks/useResource'
import { clearErrors, addError } from 'actions/errors'
import { showModal } from 'actions/modals'
import ResourceTemplateChoiceModal from '../ResourceTemplateChoiceModal'
import Alerts from '../Alerts'

import _ from 'lodash'

// Errors from retrieving a resource from this page.
export const loadResourceByRDFErrorKey = 'loadrdfresource'

const LoadByRDFForm = (props) => {
  const dispatch = useDispatch()

  const [baseURI, setBaseURI] = useState('')
  const [rdf, setRdf] = useState('')
  const [dataset, setDataset] = useState(false)
  const [resourceTemplateId, setResourceTemplateId] = useState('')
  useResource(dataset, baseURI, resourceTemplateId, loadResourceByRDFErrorKey, props.history)

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  useEffect(() => {
    // Clear resource template id so that useResource doesn't trigger with previous resource template id.
    setResourceTemplateId(null)
    // Clear errors
    if (!dataset) dispatch(clearErrors(loadResourceByRDFErrorKey))
  }, [dispatch, dataset])

  const changeRdf = (event) => {
    dispatch(clearErrors(loadResourceByRDFErrorKey))
    setRdf(event.target.value)
    // This will get set on submit.
    setDataset(false)
    event.preventDefault()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setDataset(false)
    dispatch(clearErrors(loadResourceByRDFErrorKey))
    // Try parsing
    datasetFromRdf(rdf).then((newDataset) => {
      // Determine if base URI must be provided.
      if (!hasQuadsForRootResourceTemplateId(baseURI, newDataset)) {
        dispatch(addError(loadResourceByRDFErrorKey, 'Base URI must be provided.'))
        return
      }

      // Determine if need to ask for resource template id.
      const resourceTemplateId = findRootResourceTemplateId(baseURI, newDataset)
      if (resourceTemplateId) {
        setResourceTemplateId(resourceTemplateId)
      } else {
        dispatch(showModal('ResourceTemplateChoiceModal'))
      }
      setDataset(newDataset)
    }).catch((err) => {
      dispatch(addError(loadResourceByRDFErrorKey, `Error parsing: ${err}`))
    })
  }

  const rdfPlaceHolder = `For example:
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "Tractatus Logico-Philosophicus"@eng .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
  `

  const baseURIPlaceholder = 'For example: https://trellis.sinopia.io/repository/stanford/e111a712-5a45-4c2a-9201-289b98d7452e.'

  return (
    <div>
      <h3>Load RDF into Editor</h3>
      <Alerts errorKey={loadResourceByRDFErrorKey} />

      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourceTextArea">RDF</label>
          <textarea className="form-control" id="resourceTextArea" rows="15" value={rdf}
                    onChange={(event) => changeRdf(event)} placeholder={rdfPlaceHolder}></textarea>
          <p className="text-muted">Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3).</p>
        </div>
        <div className="form-group">
          <label htmlFor="uriInput">Base URI</label>
          <input type="url" className="form-control" id="uriInput" value={baseURI}
                 onChange={(event) => setBaseURI(event.target.value)}
                 placeholder={baseURIPlaceholder} />
          <p className="text-muted">Omit brackets. If base URI is &lt;&gt;, leave blank.</p>
        </div>
        <button type="submit" disabled={ _.isEmpty(rdf) } className="btn btn-primary">Submit</button>
        <p className="text-muted">This will create a new resource that can be saved in Sinopia.</p>
      </form>
      <ResourceTemplateChoiceModal choose={chooseResourceTemplate} />
    </div>
  )
}

LoadByRDFForm.propTypes = {
  history: PropTypes.object.isRequired,
}

export default LoadByRDFForm
