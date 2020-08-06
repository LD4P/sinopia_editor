// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { datasetFromN3, n3FromDataset, jsonldFromDataset } from 'utilities/Utilities'
import Alert from '../Alert'

const RDFDisplay = (props) => {
  const [error, setError] = useState(false)
  const [dataset, setDataset] = useState(false)
  useEffect(() => {
    setError(false)
    datasetFromN3(props.rdf)
      .then((dataset) => setDataset(dataset))
      .catch((err) => setError(err.message))
  }, [props.rdf])

  const [format, setFormat] = useState('table')
  const [formattedRDF, setFormattedRDF] = useState(false)
  useEffect(() => {
    if (!dataset || format === 'table') return
    setError(false)
    if (format === 'jsonld') {
      jsonldFromDataset(dataset)
        .then((result) => setFormattedRDF(JSON.stringify(result, null, 2)))
        .catch((error) => setError(error.message))
    } else {
      n3FromDataset(dataset, format)
        .then((result) => setFormattedRDF(result.replace(/<null>/g, '<>')))
        .catch((error) => setError(error.message))
    }
  }, [dataset, format])

  if (error) {
    return (<Alert text={error} />)
  }

  if (format !== 'table' && !formattedRDF) {
    return null
  }
  if (format === 'table' && !dataset) {
    return null
  }

  let body
  if (format === 'table') {
    const rows = dataset.toArray().map((quad) => <tr key={[quad.subject.value, quad.predicate.value, quad.object.value].concat('-')}>
      <td>{quad.subject.value || '<>'}</td>
      <td>{quad.predicate.value}</td>
      <td>{quad.object.value}{quad.object.language && ` [${quad.object.language}]`}</td>
    </tr>)
    body = (
      <table className="table table-striped table-sm" style={{ backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th scope="col">Subject</th>
            <th scope="col">Predicate</th>
            <th scope="col">Object</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    )
  } else {
    body = (<pre style={{ padding: '5px' }} data-testid='rdf-display'>{ formattedRDF }</pre>)
  }

  return (
    <div>
      <form className="form-inline">
        <label htmlFor="rdfFormat">Format: &nbsp;</label>
        <select className="form-control" id="rdfFormat"
                aria-label="RDF Format Selection"
                onBlur={(event) => setFormat(event.target.value)}
                onChange={(event) => setFormat(event.target.value)}
                value={format}>
          <option value="jsonld">JSON-LD</option>
          <option value="n-triples">N-Triples</option>
          <option value="table">Table</option>
          <option value="turtle">Turtle</option>
        </select>
      </form>
      { body }
    </div>
  )
}

RDFDisplay.propTypes = {
  rdf: PropTypes.string,
  id: PropTypes.string,
}

export default RDFDisplay
