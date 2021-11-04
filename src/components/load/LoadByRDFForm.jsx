// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import {
  datasetFromRdf,
  findRootResourceTemplateId,
  hasQuadsForRootResourceTemplateId,
} from "utilities/Utilities"
import useRdfResource from "hooks/useRdfResource"
import { clearErrors, addError } from "actions/errors"
import { showModal } from "actions/modals"
import ResourceTemplateChoiceModal from "../ResourceTemplateChoiceModal"
import useAlerts from "hooks/useAlerts"

import _ from "lodash"

const LoadByRDFForm = () => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()

  const [baseURI, setBaseURI] = useState("")
  const [rdf, setRdf] = useState("")
  const [dataset, setDataset] = useState(false)
  const [resourceTemplateId, setResourceTemplateId] = useState("")
  useRdfResource(dataset, baseURI, resourceTemplateId, errorKey)

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  useEffect(() => {
    // Clear resource template id so that useRdfResource doesn't trigger with previous resource template id.
    setResourceTemplateId(null)
    // Clear errors
    if (!dataset) dispatch(clearErrors(errorKey))
  }, [dispatch, dataset, errorKey])

  const changeRdf = (event) => {
    dispatch(clearErrors(errorKey))
    setRdf(event.target.value)
    // This will get set on submit.
    setDataset(false)
    event.preventDefault()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setDataset(false)
    dispatch(clearErrors(errorKey))
    // Try parsing
    datasetFromRdf(rdf)
      .then((newDataset) => {
        // Determine if base URI must be provided.
        if (!hasQuadsForRootResourceTemplateId(baseURI, newDataset)) {
          dispatch(addError(errorKey, "Base URI must be provided."))
          return
        }

        // Determine if need to ask for resource template id.
        const resourceTemplateId = findRootResourceTemplateId(
          baseURI,
          newDataset
        )
        if (resourceTemplateId) {
          setResourceTemplateId(resourceTemplateId)
        } else {
          dispatch(showModal("ResourceTemplateChoiceModal"))
        }
        setDataset(newDataset)
      })
      .catch((err) => {
        dispatch(addError(errorKey, `Error parsing: ${err}`))
      })
  }

  const rdfPlaceHolder = `For example:
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "Tractatus Logico-Philosophicus"@eng .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
  `

  const baseURIPlaceholder =
    "For example: https://api.sinopia.io/resource/e111a712-5a45-4c2a-9201-289b98d7452e."

  return (
    <div>
      <h3>Load RDF into Editor</h3>
      <form id="loadForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="resourceTextArea">
            RDF (Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and
            Notation3 (N3))
          </label>
          <textarea
            className="form-control"
            id="resourceTextArea"
            rows="15"
            value={rdf}
            onChange={(event) => changeRdf(event)}
            placeholder={rdfPlaceHolder}
          ></textarea>
          <p />
        </div>
        <div className="mb-3">
          <label htmlFor="uriInput">
            Base URI (Omit brackets. If base URI is &lt;&gt;, leave blank.)
          </label>
          <input
            type="url"
            className="form-control"
            id="uriInput"
            value={baseURI}
            onChange={(event) => setBaseURI(event.target.value)}
            placeholder={baseURIPlaceholder}
          />
          <p />
        </div>
        <p className="text-muted">
          Clicking &ldquo;Submit&rdquo; will create a new resource that can be
          saved in Sinopia.
        </p>
        <button
          type="submit"
          disabled={_.isEmpty(rdf)}
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
      <ResourceTemplateChoiceModal choose={chooseResourceTemplate} />
    </div>
  )
}

export default LoadByRDFForm
