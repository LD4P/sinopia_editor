// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Alert from "components/alerts/Alert"
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
    if (_.isEmpty(unusedRDF)) {
      setDataset(null)
    } else {
      datasetFromN3(unusedRDF)
        .then((dataset) => setDataset(dataset))
        .catch((err) => setError(err.message || err))
    }
  }, [unusedRDF])

  const onChangeFormat = (event) => {
    setFormat(event.target.value)
    event.preventDefault()
  }

  if (error) {
    return <Alert errors={[error]} />
  }

  if (!dataset) return null

  return (
    <div className="rdf-display-panel">
      <div className="row mb-3 gx-2">
        <div className="col-auto">
          <strong>
            Unable to load the entire resource. The unused triples are listed
            below.{" "}
          </strong>
          <label htmlFor="rdfFormat" className="col-form-label">
            View as:
          </label>
        </div>
        <div className="col-auto">
          <select
            className="form-select"
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
