// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { n3FromDataset, jsonldFromDataset } from "utilities/Utilities"
import Alert from "components/alerts/Alert"
import ClipboardButton from "../../ClipboardButton"

const RDFDisplay = ({ format, dataset }) => {
  const [error, setError] = useState(false)
  const [formattedRDF, setFormattedRDF] = useState(false)

  useEffect(() => {
    if (!dataset || format === "table") return
    setError(false)
    if (format === "jsonld") {
      jsonldFromDataset(dataset)
        .then((result) => setFormattedRDF(JSON.stringify(result, null, 2)))
        .catch((err) => setError(err.message || err))
    } else {
      n3FromDataset(dataset, format)
        .then((result) => setFormattedRDF(result.replace(/<null>/g, "<>")))
        .catch((err) => setError(err.message || err))
    }
  }, [dataset, format])

  if (error) {
    return <Alert errors={[error]} />
  }

  if (format !== "table" && !formattedRDF) {
    return null
  }

  if (format === "table") {
    const rows = dataset.toArray().map((quad) => (
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
    return (
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
  }
  return (
    <React.Fragment>
      <div className="mb-2">
        <ClipboardButton text={formattedRDF} label="RDF" />
      </div>
      <pre style={{ padding: "5px" }} data-testid="rdf-display">
        {formattedRDF}
      </pre>
    </React.Fragment>
  )
}

RDFDisplay.propTypes = {
  dataset: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
}

export default RDFDisplay
