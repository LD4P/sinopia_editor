// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Alert from "../Alert"
import RDFDisplay from "components/editor/preview/RDFDisplay"
import { selectCurrentResourceKey } from "selectors/resources"
import { selectUnusedRDF } from "selectors/modals"
import { datasetFromN3 } from "utilities/Utilities"
import _ from "lodash"

const UnusedRDFDisplay = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const unusedRDF = useSelector((state) => selectUnusedRDF(state, resourceKey))
  const [error, setError] = useState(false)
  const [format, setFormat] = useState("table")
  const [dataset, setDataset] = useState(null)

  useEffect(() => {
    setError(false)
    if (_.isEmpty(unusedRDF)) return
    datasetFromN3(unusedRDF)
      .then((dataset) => setDataset(dataset))
      .catch((err) => setError(err.message || err))
  }, [unusedRDF])

  const onChangeFormat = (event) => {
    setFormat(event.target.value)
    event.preventDefault()
  }

  if (error) {
    return <Alert text={error} />
  }

  if (!dataset) return null

  return (
    <div className="alert alert-warning" role="alert">
      <strong>Unable to load the entire resource.</strong> The unused triples
      are:
      <div className="row mb-3">
        <label htmlFor="rdfFormat" className="col-form-label col-sm-1">
          Format:{" "}
        </label>
        <div className="col-sm-3">
          <select
            className="form-control"
            id="rdfFormat"
            aria-label="RDF Format Selection"
            onBlur={onChangeFormat}
            onChange={onChangeFormat}
            value={format}
          >
            <option value="jsonld">JSON-LD</option>
            <option value="n-triples">N-Triples</option>
            <option value="table">Table (RDF)</option>
            <option value="turtle">Turtle</option>
          </select>
        </div>
      </div>
      <RDFDisplay dataset={dataset} format={format} />
    </div>
  )
}

export default UnusedRDFDisplay
