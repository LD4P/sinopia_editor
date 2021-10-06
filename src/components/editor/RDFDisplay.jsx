// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { n3FromDataset, jsonldFromDataset } from "utilities/Utilities"
import Alert from "../Alert"

const RDFDisplay = (props) => {
  const [error, setError] = useState(false)
  const [format, setFormat] = useState("table")
  const [formattedRDF, setFormattedRDF] = useState(false)
  useEffect(() => {
    if (!props.dataset || format === "table") return
    setError(false)
    if (format === "jsonld") {
      jsonldFromDataset(props.dataset)
        .then((result) => setFormattedRDF(JSON.stringify(result, null, 2)))
        .catch((err) => setError(err.message || err))
    } else {
      n3FromDataset(props.dataset, format)
        .then((result) => setFormattedRDF(result.replace(/<null>/g, "<>")))
        .catch((err) => setError(err.message || err))
    }
  }, [props.dataset, format])

  if (error) {
    return <Alert text={error} />
  }

  if (format !== "table" && !formattedRDF) {
    return null
  }

  let body
  if (format === "table") {
    const rows = props.dataset.toArray().map((quad) => (
      <tr
        key={[
          quad.subject.value,
          quad.predicate.value,
          quad.object.value,
        ].concat("-")}
      >
        <td>{quad.subject.value || "<>"}</td>
        <td>{quad.predicate.value}</td>
        <td>
          {quad.object.value}
          {quad.object.language && ` [${quad.object.language}]`}
        </td>
      </tr>
    ))
    body = (
      <table
        className="table table-striped table-sm"
        style={{ backgroundColor: "white" }}
      >
        <thead>
          <tr>
            <th scope="col">Subject</th>
            <th scope="col">Predicate</th>
            <th scope="col">Object</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  } else {
    body = (
      <pre style={{ padding: "5px" }} data-testid="rdf-display">
        {formattedRDF}
      </pre>
    )
  }

  return (
    <div>
      <form className="row mb-3">
        <label htmlFor="rdfFormat" className="col-form-label col-sm-1">
          Format:{" "}
        </label>
        <div className="col-sm-3">
          <select
            className="form-control"
            id="rdfFormat"
            aria-label="RDF Format Selection"
            onBlur={(event) => setFormat(event.target.value)}
            onChange={(event) => setFormat(event.target.value)}
            value={format}
          >
            <option value="jsonld">JSON-LD</option>
            <option value="n-triples">N-Triples</option>
            <option value="table">Table</option>
            <option value="turtle">Turtle</option>
          </select>
        </div>
      </form>
      {body}
    </div>
  )
}

RDFDisplay.propTypes = {
  dataset: PropTypes.object.isRequired,
  id: PropTypes.string,
}

export default RDFDisplay
